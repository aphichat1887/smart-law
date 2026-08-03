// src/app/search/search.component.ts
// ตัวอย่าง component (standalone) เรียกใช้ SearchService — ปรับ selector/path ตามโปรเจกต์จริง

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchService, SourceItem } from '../services/search.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="search-box">
      <input
        [(ngModel)]="query"
        (keyup.enter)="onSearch()"
        placeholder="ถามคำถามกฎหมาย..."
      />
      <button (click)="onSearch()" [disabled]="loading">
        {{ loading ? 'กำลังค้นหา...' : 'ค้นหา' }}
      </button>

      <div *ngIf="answer" class="answer">
        <h3>คำตอบ</h3>
        <p>{{ answer }}</p>

        <h4>อ้างอิง</h4>
        <ul>
          <li *ngFor="let s of sources">
            มาตรา {{ s.article }} (score: {{ s.score.toFixed(3) }})
          </li>
        </ul>
      </div>

      <p *ngIf="error" class="error">{{ error }}</p>
    </div>
  `,
})
export class SearchComponent {
  query = '';
  answer = '';
  sources: SourceItem[] = [];
  loading = false;
  error = '';

  constructor(private searchService: SearchService) {}

  onSearch(): void {
    if (!this.query.trim()) return;

    this.loading = true;
    this.error = '';
    this.answer = '';

    this.searchService.askQuestion(this.query).subscribe({
      next: (res) => {
        this.answer = res.answer;
        this.sources = res.sources;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'เกิดข้อผิดพลาด: ' + (err?.error?.detail ?? err.message);
        this.loading = false;
      },
    });
  }
}
