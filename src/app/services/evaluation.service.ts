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
  score: number;
  correct: boolean;
}

export interface EvaluateResponse {
  k: number;
  total: number;
  correct_count: number;
  precision_at_k: number;
  results: EvaluateRow[];
}

@Injectable({
  providedIn: 'root',
})
export class EvaluationService {
  private apiUrl = environment.apiUrl;

  // เก็บผลล่าสุดไว้ในหน่วยความจำ ให้หน้า "ผลการทดสอบ" อ่านมาแสดงได้
  // (อยู่ได้จนกว่าจะรีเฟรชหน้าเว็บทั้งหน้า เพราะ service instance เดียวกันถูกใช้ร่วมกันทั้งแอป)
  lastResult: EvaluateResponse | null = null;

  constructor(private http: HttpClient) {}

  evaluate(file: File, k: number = 3): Observable<EvaluateResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const params = new HttpParams().set('k', k);

    return this.http
      .post<EvaluateResponse>(`${this.apiUrl}/evaluate`, formData, { params })
      .pipe(tap((res) => (this.lastResult = res)));
  }
}
