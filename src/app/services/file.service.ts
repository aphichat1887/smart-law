// src/app/services/file.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface FileItem {
  filename: string;
  article_count: number;
}

export interface UploadResponse {
  filename: string;
  articles_added: number;
  total_articles: number;
}

export interface DeleteResponse {
  filename: string;
  articles_removed: number;
  total_articles: number;
}

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  listFiles(): Observable<FileItem[]> {
    return this.http.get<FileItem[]>(`${this.apiUrl}/files`);
  }

  uploadFile(file: File): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<UploadResponse>(`${this.apiUrl}/upload`, formData);
  }

  deleteFile(filename: string): Observable<DeleteResponse> {
    return this.http.delete<DeleteResponse>(
      `${this.apiUrl}/files/${encodeURIComponent(filename)}`
    );
  }
}
