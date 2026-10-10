import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EvaluationService, findBestIndexes } from '../../services/evaluation.service';
import { SettingsService, DistanceMetric } from '../../services/settings.service';
import { Header } from '../header/header';

// ค่าคงที่ตามที่กำหนด: ไม่ให้ผู้ใช้แก้
const FIXED_K = 3;
const FIXED_P = 3;

const METRIC_LABELS: Record<DistanceMetric, string> = {
  euclidean: 'Euclidean',
  manhattan: 'Manhattan',
  minkowski: 'Minkowski',
};

interface CompareRow {
  metric: DistanceMetric; // [แก้] เพิ่ม เพื่อรู้ว่าแถวนี้คือ metric ไหน
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
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    FormsModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    Header,
  ],

  templateUrl: './test-page.html',
  styleUrl: './test-page.scss',
})
export class TestPage implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  readonly metricLabels = METRIC_LABELS;
  readonly sampleFileUrl = 'https://drive.google.com/drive/folders/1p8cqsHvHQm7lYtPgg-A1I2qmlYlmvHEL?usp=sharing';
  selectedFile: File | null = null;
  selectedFileName: string | null = null;

  // ---- ส่วนทดสอบ (เลือกได้หลาย metric) ----
  testMetrics: Record<DistanceMetric, boolean> = {
    euclidean: true,
    manhattan: true,
    minkowski: true,
  };
  testing = false;
  resultRows: CompareRow[] | null = null;

  // ---- ส่วนเลือกใช้จริงกับระบบ (ปุ่ม "ใช้ตัวนี้" ในตารางผล) ----
  applying = false;
  applyingIndex: number | null = null; // [แก้] แถวที่กำลังบันทึก ใช้โชว์ spinner บนปุ่มของแถวนั้น

  // ค่าที่ระบบใช้งานอยู่จริงตอนนี้ (ดึงจาก backend)
  currentMetric: DistanceMetric | null = null;
  currentK: number | null = null;
  currentP: number | null = null;

  constructor(
    private router: Router,
    private evaluationService: EvaluationService,
    private settingsService: SettingsService,
    private snackBar: MatSnackBar
  ) { }

  /** index ของ metric ที่ดีที่สุดในตารางผลทดสอบ (ว่างถ้าทดสอบแค่ 1 อัน) */
  get bestIndexes(): number[] {
    return this.resultRows ? findBestIndexes(this.resultRows) : [];
  }

  /** ข้อความแนะนำเหนือตาราง */
  get recommendText(): string {
    const rows = this.resultRows;
    if (!rows || rows.length < 2) return '';
    const best = this.bestIndexes;
    if (best.length === rows.length) {
      return 'ทุก metric ได้ผลเท่ากัน ไม่มีตัวไหนโดดเด่นกว่า';
    }
    const names = best.map((i) => rows[i].label).join(' และ ');
    return `แนะนำ ${names} (ค่าเฉลี่ย Recall@K, Hit@K และ MRR สูงที่สุด)`;
  }

  get busy(): boolean {
    return this.testing || this.applying;
  }

  ngOnInit(): void {
    // โหลดค่าที่ระบบใช้อยู่ เพื่อโชว์ "ระบบใช้ค่านี้อยู่" และป้าย "ใช้งานอยู่" ในตาราง
    this.settingsService.getKnnSettings().subscribe({
      next: (res) => {
        this.currentMetric = res.metric;
        this.currentK = res.k;
        this.currentP = res.p;
      },
      error: () => { /* โหลดไม่ได้ก็ไม่โชว์กล่องค่าปัจจุบัน */ },
    });

    // กลับมาจากหน้า "ผลการทดสอบ" -> โชว์ผลล่าสุดต่อ
    const last = this.evaluationService.lastResults;
    if (last.length > 0) {
      this.resultRows = last.map((r) => {
        const metric: DistanceMetric = r.metric ?? 'euclidean';
        return { label: METRIC_LABELS[metric], ...r, metric };
      });
    }
  }

  /** [แก้] true ถ้าแถว i คือ metric ที่ระบบใช้อยู่ตอนนี้ */
  isCurrentRow(i: number): boolean {
    const row = this.resultRows?.[i];
    return !!row && row.metric === this.currentMetric;
  }

  /** [แก้] ปุ่ม "ใช้ตัวนี้" — บันทึก metric ของแถว i เป็นค่าที่ระบบใช้จริง (แทน applySettings เดิม) */
  useMetric(i: number): void {
    const row = this.resultRows?.[i];
    if (!row) return;

    const requesterEmail = localStorage.getItem('adminEmail');
    if (!requesterEmail) {
      this.snackBar.open('ไม่พบข้อมูลผู้ใช้ กรุณา Login ใหม่', 'ปิด', { duration: 4000 });
      return;
    }
    this.applying = true;
    this.applyingIndex = i;
    this.settingsService
      .updateKnnSettings({
        requester_email: requesterEmail,
        metric: row.metric,
        k: FIXED_K,
        p: FIXED_P,
      })
      .subscribe({
        next: (res) => {
          this.applying = false;
          this.applyingIndex = null;
          this.currentMetric = res.metric;
          this.currentK = res.k;
          this.currentP = res.p;
          this.snackBar.open(
            `ระบบจะใช้ ${METRIC_LABELS[res.metric]}, K=${res.k}` +
            (res.metric === 'minkowski' ? `, p=${res.p}` : '') +
            ' กับการถามคำถามทุกครั้ง จนกว่าจะเปลี่ยนอีก',
            'ปิด',
            { duration: 5000 }
          );
        },
        error: (err) => {
          this.applying = false;
          this.applyingIndex = null;
          const msg = err?.error?.detail ?? err.message ?? 'บันทึกไม่สำเร็จ';
          this.snackBar.open(msg, 'ปิด', { duration: 5000 });
        },
      });
  }

  openFilePicker(): void {
    this.fileInput.nativeElement.click();
  }

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
    this.resultRows = null;
  }

  private get pickedTestMetrics(): DistanceMetric[] {
    return (Object.keys(this.testMetrics) as DistanceMetric[]).filter((m) => this.testMetrics[m]);
  }

  /** ทดสอบตาม metric ที่ติ๊กไว้ (ไม่กระทบค่าที่ระบบใช้งานจริง) */
  startTest(): void {
    if (!this.selectedFile) return;

    const picked = this.pickedTestMetrics;
    if (picked.length === 0) {
      this.snackBar.open('กรุณาเลือก metric อย่างน้อย 1 อัน', 'ปิด', { duration: 3000 });
      return;
    }
    this.testing = true;
    this.resultRows = null;

    if (picked.length === 1) {
      // metric เดียว -> ได้ผลรายข้อด้วย (เก็บไว้ให้หน้า "ผลการทดสอบ")
      const metric = picked[0];
      this.evaluationService
        .evaluate(this.selectedFile, FIXED_K, metric, FIXED_P)
        .subscribe({
          next: (res) => {
            this.testing = false;
            this.resultRows = [{ label: METRIC_LABELS[metric], ...res, metric }];
          },
          error: (err) => this.onTestError(err),
        });
      return;
    }

    this.evaluationService
      .evaluateCompare(this.selectedFile, FIXED_K, FIXED_P, picked)
      .subscribe({
        next: (res) => {
          this.testing = false;
          this.resultRows = picked
            .filter((m) => res.comparison[m])
            .map((m) => ({ label: METRIC_LABELS[m], ...res.comparison[m]!, metric: m }));
        },
        error: (err) => this.onTestError(err),
      });
  }

  private onTestError(err: any): void {
    this.testing = false;
    const msg = err?.error?.detail ?? err.message ?? 'ทดสอบไม่สำเร็จ';
    this.snackBar.open(msg, 'ปิด', { duration: 5000 });
  }

  /** [แก้] ปุ่ม "ดูผลรายข้อ" ของแถว i — ส่ง metric ไปกับ URL (แทน goToResult เดิม) */
  viewDetail(i: number): void {
    const row = this.resultRows?.[i];
    this.router.navigate(['/result'], { queryParams: row ? { metric: row.metric } : {} });
  }
}