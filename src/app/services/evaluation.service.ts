// src/app/services/evaluation.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface EvaluateRow {
  id: string;
  question: string;
  actual_article: string;
  predicted_articles: string[];
  top1_article: string;
  matched_articles: string[];
  recall: number;
  hit: boolean;
  reciprocal_rank: number;
  correct: boolean;
}

export interface EvaluateResponse {
  k: number;
  metric?: DistanceMetric;
  total: number;
  correct_count: number;
  recall_at_k: number;
  hit_at_k: number;
  mrr: number;
  results: EvaluateRow[];
}

export type DistanceMetric = 'euclidean' | 'manhattan' | 'minkowski';

export interface CompareMetricSummary {
  k: number;
  total: number;
  correct_count: number;
  recall_at_k: number;
  hit_at_k: number;
  mrr: number;
  results: EvaluateRow[];
}

export interface CompareResponse {
  k: number;
  p: number;
  comparison: Partial<Record<DistanceMetric, CompareMetricSummary>>;
}

@Injectable({
  providedIn: 'root',
})
export class EvaluationService {
  private apiUrl = environment.apiUrl;

  // เก็บผลทดสอบรอบล่าสุดไว้ในหน่วยความจำ (ทดสอบ 1 metric = 1 รายการ, หลาย metric = หลายรายการ)
  // ให้หน้า "ผลการทดสอบ" อ่านไปแสดงได้ (อยู่ได้จนกว่าจะรีเฟรชหน้าเว็บ)
  lastResults: EvaluateResponse[] = [];

  constructor(private http: HttpClient) { }

  evaluate(
    file: File,
    k: number = 3,
    metric: DistanceMetric = 'euclidean',
    p: number = 3
  ): Observable<EvaluateResponse> {
    const formData = new FormData();
    formData.append('file', file);

    let params = new HttpParams().set('k', k).set('metric', metric);
    if (metric === 'minkowski') {
      params = params.set('p', p);
    }

    return this.http
      .post<EvaluateResponse>(`${this.apiUrl}/evaluate`, formData, { params })
      .pipe(tap((res) => (this.lastResults = [{ ...res, metric }])));
  }

  // เทียบทั้ง 3 metric (euclidean / manhattan / minkowski) พร้อมกันในไฟล์เดียว
  evaluateCompare(
    file: File,
    k: number = 3,
    p: number = 3,
    metrics?: DistanceMetric[]
  ): Observable<CompareResponse> {
    const formData = new FormData();
    formData.append('file', file);

    let params = new HttpParams().set('k', k).set('p', p);
    if (metrics && metrics.length > 0) {
      params = params.set('metrics', metrics.join(','));
    }

    return this.http
      .post<CompareResponse>(`${this.apiUrl}/evaluate/compare`, formData, { params })
      .pipe(
        tap((res) => {
          this.lastResults = (Object.keys(res.comparison) as DistanceMetric[]).map((m) => ({
            ...res.comparison[m]!,
            metric: m,
          }));
        })
      );
  }
}
/**
 * หา "ตัวที่ดีที่สุด" จากผลทดสอบหลาย metric
 * เกณฑ์: ค่าเฉลี่ยของ Recall@K, Hit@K และ MRR สูงสุด (ถ้าเท่ากันจะถือว่าดีเท่ากันทุกตัวที่เสมอ)
 * คืนค่าเป็น index ของรายการที่ดีที่สุด (มากกว่า 1 ตัวได้ถ้าเสมอ)
 */
export function findBestIndexes(
  items: { recall_at_k: number; hit_at_k: number; mrr: number }[]
): number[] {
  if (items.length < 2) return [];
  const scores = items.map((r) => (r.recall_at_k + r.hit_at_k + r.mrr) / 3);
  const max = Math.max(...scores);
  return scores
    .map((s, i) => (Math.abs(s - max) < 1e-9 ? i : -1))
    .filter((i) => i >= 0);
}
