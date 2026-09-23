import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EvaluationService } from '../../services/evaluation.service';

export type DistanceMetric = 'euclidean' | 'manhattan' | 'minkowski';

const METRIC_LABELS: Record<DistanceMetric, string> = {
  euclidean: 'Euclidean',
  manhattan: 'Manhattan',
  minkowski: 'Minkowski',
};

interface CompareRow {
  label: string;
  recall_at_k: number;
  hit_at_k: number;
  mrr: number;
  correct_count: number;
  total: number;
}

@Component({
  selector: 'app-test-page',
  standalone: true,

  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    FormsModule,
    MatTooltipModule,
    MatMenuModule,
    MatRadioModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],

  templateUrl: './test-page.html',
  styleUrl: './test-page.scss',
})
export class TestPage implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  isLoggedIn = false;
  isSuperAdmin = false;

  selectedFile: File | null = null;
  selectedFileName: string | null = null;

  selectedMetric: DistanceMetric = 'euclidean';
  minkowskiP = 3;

  evaluating = false;
  comparing = false;

  recallText: string | null = null;
  hitText: string | null = null;
  mrrText: string | null = null;
  hasResult = false;

  compareRows: CompareRow[] | null = null;

  constructor(
    private router: Router,
    private evaluationService: EvaluationService,
    private snackBar: MatSnackBar
  ) { }

  /** ปิดปุ่ม/inputs ทุกตัวระหว่างกำลังยิง request อยู่ (ไม่ว่าจะทดสอบเดี่ยวหรือเปรียบเทียบ) */
  get busy(): boolean {
    return this.evaluating || this.comparing;
  }

  ngOnInit(): void {
    this.isLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';

    this.isSuperAdmin =
      localStorage.getItem('adminRole') === 'super_admin';

    // ถ้ามีผลทดสอบค้างจากรอบก่อนหน้าอยู่แล้ว (ยังไม่ได้รีเฟรชหน้าเว็บ) โชว์ค่าล่าสุดไว้เลย
    const last = this.evaluationService.lastResult;
    if (last) {
      this.hasResult = true;
      this.recallText = this.formatMetric(last.recall_at_k);
      this.hitText = this.formatMetric(last.hit_at_k);
      this.mrrText = this.formatMetric(last.mrr);
      this.selectedFileName = null;
    }
  }

  openFilePicker(): void {
    this.fileInput.nativeElement.click();
  }

  /** แค่เก็บไฟล์ที่เลือกไว้ ไม่ยิง request ทันที ให้ผู้ใช้เลือก metric ก่อนค่อยกดปุ่มทดสอบ */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const lower = file.name.toLowerCase();
    if (!lower.endsWith('.xlsx') && !lower.endsWith('.xls')) {
      this.snackBar.open('รองรับเฉพาะไฟล์ .xlsx หรือ .xls เท่านั้น', 'ปิด', { duration: 3000 });
      input.value = '';
      return;
    }

    this.selectedFile = file;
    this.selectedFileName = file.name;
    this.hasResult = false;
    this.compareRows = null;
  }

  /** ทดสอบด้วย metric เดียวที่เลือกไว้จาก radio */
  startEvaluate(): void {
    if (!this.selectedFile) return;

    this.evaluating = true;
    this.hasResult = false;
    this.compareRows = null;

    this.evaluationService
      .evaluate(this.selectedFile, 3, this.selectedMetric, this.minkowskiP)
      .subscribe({
        next: (res) => {
          this.evaluating = false;
          this.hasResult = true;
          this.recallText = this.formatMetric(res.recall_at_k);
          this.hitText = this.formatMetric(res.hit_at_k);
          this.mrrText = this.formatMetric(res.mrr);
          this.snackBar.open(
            `ทดสอบเสร็จแล้ว (${METRIC_LABELS[this.selectedMetric]}): ` +
            `ถูกต้อง ${res.correct_count}/${res.total} ข้อ ` +
            `(Recall@${res.k} ${this.formatMetric(res.recall_at_k)}, ` +
            `Hit@${res.k} ${this.formatMetric(res.hit_at_k)}, ` +
            `MRR ${this.formatMetric(res.mrr)})`,
            'ปิด',
            { duration: 5000 }
          );
        },
        error: (err) => {
          this.evaluating = false;
          const msg = err?.error?.detail ?? err.message ?? 'ทดสอบไม่สำเร็จ';
          this.snackBar.open(msg, 'ปิด', { duration: 5000 });
        },
      });
  }

  /** ทดสอบเทียบทั้ง 3 metric พร้อมกันในไฟล์เดียวกัน (ไม่สนใจ radio ที่เลือกไว้) */
  startCompare(): void {
    if (!this.selectedFile) return;

    this.comparing = true;
    this.hasResult = false;
    this.compareRows = null;

    this.evaluationService.evaluateCompare(this.selectedFile, 3, this.minkowskiP).subscribe({
      next: (res) => {
        this.comparing = false;
        this.compareRows = (Object.keys(res.comparison) as DistanceMetric[]).map((metric) => ({
          label: METRIC_LABELS[metric],
          ...res.comparison[metric],
        }));
        this.snackBar.open('เปรียบเทียบทั้ง 3 metric เสร็จแล้ว', 'ปิด', { duration: 4000 });
      },
      error: (err) => {
        this.comparing = false;
        const msg = err?.error?.detail ?? err.message ?? 'เปรียบเทียบไม่สำเร็จ';
        this.snackBar.open(msg, 'ปิด', { duration: 5000 });
      },
    });
  }

  private formatMetric(value: number): string {
    return `${value.toFixed(2)} หรือ ${(value * 100).toFixed(0)}%`;
  }

  // กลับหน้าหลัก
  goHome(): void {
    this.router.navigate(['/']);
  }

  // ไปหน้า Login
  goToLogin(): void {
    this.router.navigate(['/admin/login']);
  }

  // ไปหน้า Upload
  goToUpload(): void {
    this.router.navigate(['/upload']);
  }

  // ไปหน้าทดสอบ
  goToTest(): void {
    this.router.navigate(['/test']);
  }

  goToManageAdmins(): void {
    this.router.navigate(['/manage-admins']);
  }

  goToResult(): void {
    this.router.navigate(['/result']);
  }

  // Logout
  logout(): void {
    localStorage.removeItem('isAdminLoggedIn');

    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminRole');
    this.isLoggedIn = false;
    this.isSuperAdmin = false;
    this.router.navigate(['/']);
  }
}