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
}

export interface CompareResponse {
  k: number;
  p: number;
  comparison: Record<DistanceMetric, CompareMetricSummary>;
}

@Injectable({
  providedIn: 'root',
})
export class EvaluationService {
  private apiUrl = environment.apiUrl;

  // เก็บผลล่าสุดไว้ในหน่วยความจำ ให้หน้า "ผลการทดสอบ" อ่านมาแสดงได้
  // (อยู่ได้จนกว่าจะรีเฟรชหน้าเว็บทั้งหน้า เพราะ service instance เดียวกันถูกใช้ร่วมกันทั้งแอป)
  lastResult: EvaluateResponse | null = null;

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
      .pipe(tap((res) => (this.lastResult = res)));
  }

  // เทียบทั้ง 3 metric (euclidean / manhattan / minkowski) พร้อมกันในไฟล์เดียว
  // ไม่บันทึกลง lastResult เพราะหน้า "ผลการทดสอบ" ยังออกแบบไว้สำหรับผลแบบ metric เดียว
  evaluateCompare(file: File, k: number = 3, p: number = 3): Observable<CompareResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const params = new HttpParams().set('k', k).set('p', p);

    return this.http.post<CompareResponse>(`${this.apiUrl}/evaluate/compare`, formData, {
      params,
    });
  }
}