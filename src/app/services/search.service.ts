// src/app/services/search.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SourceItem {
  article: string;
  text: string;
  score: number;
}

export interface SearchResponse {
  answer: string;
  sources: SourceItem[];
}

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  askQuestion(query: string): Observable<SearchResponse> {
    return this.http.post<SearchResponse>(`${this.apiUrl}/search`, { query });
  }
}
