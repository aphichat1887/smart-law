import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { ActivatedRoute, Router } from '@angular/router';
import { EvaluationService, EvaluateResponse, findBestIndexes } from '../../services/evaluation.service';
import { DistanceMetric } from '../../services/settings.service';
import { Header } from '../header/header';

const METRIC_LABELS: Record<DistanceMetric, string> = {
  euclidean: 'Euclidean',
  manhattan: 'Manhattan',
  minkowski: 'Minkowski',
};

@Component({
  selector: 'app-result-test-page',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    Header,
  ],
  templateUrl: './result-test-page.html',
  styleUrl: './result-test-page.scss',
})
export class ResultTestPage implements OnInit {
  readonly metricLabels = METRIC_LABELS;

  // ผลทดสอบของแต่ละ metric (ทดสอบหลายอัน = มีหลายรายการ)
  allResults: EvaluateResponse[] = [];
  // ผลของ metric ที่กดมาจากหน้าทดสอบ
  selected: EvaluateResponse | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private evaluationService: EvaluationService
  ) { }

  ngOnInit(): void {
    this.allResults = this.evaluationService.lastResults;

    // [แก้] เลือกผลตาม ?metric=... ที่หน้าทดสอบส่งมา (ไม่มี/ไม่ตรง -> ตัวแรก)
    const metric = this.route.snapshot.queryParamMap.get('metric');
    this.selected =
      this.allResults.find((r) => (r.metric ?? 'euclidean') === metric) ??
      this.allResults[0] ??
      null;
  }

  /** metric ที่ดีที่สุดจากการทดสอบรอบนี้ (ว่างถ้าทดสอบแค่ 1 อัน) */
  get bestIndexes(): number[] {
    return findBestIndexes(this.allResults);
  }

  isBest(r: EvaluateResponse): boolean {
    return this.bestIndexes.includes(this.allResults.indexOf(r));
  }

  labelOf(r: EvaluateResponse): string {
    return METRIC_LABELS[r.metric ?? 'euclidean'];
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