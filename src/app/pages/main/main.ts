// src/app/pages/main/main.ts
// แก้ 2 จุดจากโค้ดเดิมที่ให้ไป: (1) class ชื่อ Main ให้ตรงกับที่ app.routes.ts import
// (2) templateUrl/styleUrls ให้ชี้ไปไฟล์ในโฟลเดอร์เดียวกัน (main.html / main.scss)
// ปรับ import path ของ SearchService ให้ตรงกับตำแหน่งไฟล์จริงในโปรเจกต์

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { SearchService, SourceItem } from '../../services/search.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatMenuModule,
  ],
  templateUrl: './main.html',
  styleUrls: ['./main.scss'],
})
export class Main implements OnInit {
  question = '';
  answer = '';
  sources: SourceItem[] = [];
  loading = false;
  error = '';
  isLoggedIn = false;

  constructor(
    private searchService: SearchService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
  }

  goToLogin(): void {
    this.router.navigate(['/admin/login']);
  }

  logout(): void {
    localStorage.removeItem('isAdminLoggedIn');
    this.isLoggedIn = false;
  }

  ask(): void {
    const q = this.question.trim();
    if (!q) return;

    this.loading = true;
    this.error = '';
    this.answer = '';
    this.sources = [];

    this.searchService.askQuestion(q).subscribe({
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