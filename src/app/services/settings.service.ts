// src/app/services/settings.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export type DistanceMetric = 'euclidean' | 'manhattan' | 'minkowski';

export interface KnnSettings {
  metric: DistanceMetric;
  k: number;
  p: number;
}

export interface UpdateKnnSettingsRequest {
  requester_email: string;
  metric: DistanceMetric;
  k: number;
  p: number;
}

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ดึงค่า metric/K/p ที่ admin ตั้งไว้ล่าสุด (ใช้เป็นค่าตั้งต้นตอนเปิดหน้าตั้งค่า)
  getKnnSettings(): Observable<KnnSettings> {
    return this.http.get<KnnSettings>(`${this.apiUrl}/settings/knn`);
  }

  // บันทึกค่าใหม่ -> backend จำไว้จนกว่าจะมีการเปลี่ยนอีกครั้ง (เก็บลงไฟล์ ไม่หายตอน restart)
  updateKnnSettings(req: UpdateKnnSettingsRequest): Observable<KnnSettings> {
    return this.http.post<KnnSettings>(`${this.apiUrl}/settings/knn`, req);
  }
}
