import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EvaluationService, EvaluateResponse, findBestIndexes } from '../../services/evaluation.service';
import { SettingsService, DistanceMetric } from '../../services/settings.service';
import { Header } from '../header/header';

const METRIC_LABELS: Record<DistanceMetric, string> = {
  euclidean: 'Euclidean',
  manhattan: 'Manhattan',
  minkowski: 'Minkowski',
};

// ค่าคงที่ตามที่กำหนด (เหมือนหน้าทดสอบ)
const FIXED_K = 3;
const FIXED_P = 3;

@Component({
  selector: 'app-result-test-page',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    Header,
  ],
  templateUrl: './result-test-page.html',
  styleUrl: './result-test-page.scss',
})
export class ResultTestPage implements OnInit {
  readonly metricLabels = METRIC_LABELS;

  // ผลทดสอบของแต่ละ metric (ทดสอบหลายอัน = มีหลายรายการ)
  allResults: EvaluateResponse[] = [];
  selected: EvaluateResponse | null = null;

  currentMetric: DistanceMetric | null = null; // metric ที่ระบบใช้อยู่ตอนนี้
  applying = false;

  constructor(
    private router: Router,
    private evaluationService: EvaluationService,
    private settingsService: SettingsService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.allResults = this.evaluationService.lastResults;
    this.selected = this.allResults[0] ?? null;

    this.settingsService.getKnnSettings().subscribe({
      next: (res) => (this.currentMetric = res.metric),
      error: () => { },
    });
  }

  /** metric ที่ดีที่สุดจากการทดสอบรอบนี้ (ว่างถ้าทดสอบแค่ 1 อัน) */
  get bestIndexes(): number[] {
    return findBestIndexes(this.allResults);
  }

  isBest(r: EvaluateResponse): boolean {
    return this.bestIndexes.includes(this.allResults.indexOf(r));
  }

  get recommendText(): string {
    if (this.allResults.length < 2) return '';
    const best = this.bestIndexes;
    if (best.length === this.allResults.length) {
      return 'ทุก metric ได้ผลเท่ากัน ไม่มีตัวไหนโดดเด่นกว่า';
    }
    const names = best.map((i) => this.labelOf(this.allResults[i])).join(' และ ');
    return `แนะนำ ${names} (ค่าเฉลี่ย Recall@K, Hit@K และ MRR สูงที่สุด)`;
  }

  select(r: EvaluateResponse): void {
    this.selected = r;
  }

  labelOf(r: EvaluateResponse): string {
    return METRIC_LABELS[r.metric ?? 'euclidean'];
  }

  get isCurrent(): boolean {
    return !!this.selected && this.currentMetric === (this.selected.metric ?? 'euclidean');
  }

  /** ใช้ metric ของผลทดสอบที่กำลังดูอยู่ เป็นค่าที่ระบบใช้จริง */
  applySelected(): void {
    if (!this.selected) return;

    const requesterEmail = localStorage.getItem('adminEmail');
    if (!requesterEmail) {
      this.snackBar.open('ไม่พบข้อมูลผู้ใช้ กรุณา Login ใหม่', 'ปิด', { duration: 4000 });
      return;
    }

    const metric = this.selected.metric ?? 'euclidean';
    this.applying = true;
    this.settingsService
      .updateKnnSettings({ requester_email: requesterEmail, metric, k: FIXED_K, p: FIXED_P })
      .subscribe({
        next: (res) => {
          this.applying = false;
          this.currentMetric = res.metric;
          this.snackBar.open(
            `ระบบจะใช้ ${METRIC_LABELS[res.metric]} กับการถามคำถามทุกครั้ง จนกว่าจะเปลี่ยนอีก`,
            'ปิด',
            { duration: 5000 }
          );
        },
        error: (err) => {
          this.applying = false;
          const msg = err?.error?.detail ?? err.message ?? 'บันทึกไม่สำเร็จ';
          this.snackBar.open(msg, 'ปิด', { duration: 5000 });
        },
      });
  }

  formatMetric(value: number): string {
    return `${value.toFixed(2)} หรือ ${(value * 100).toFixed(0)}%`;
  }

  // ย้อนกลับไปหน้าทดสอบ (ผลที่เพิ่งทดสอบยังอยู่)
  goBack(): void {
    this.router.navigate(['/test']);
  }

  goToTest(): void {
    this.router.navigate(['/test']);
  }
}
