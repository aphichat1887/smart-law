// src/app/pages/main/main.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { SearchService, SourceItem } from '../../services/search.service';
import { Header } from '../header/header';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    Header,
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

  constructor(private searchService: SearchService) {}

  ngOnInit(): void {}

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