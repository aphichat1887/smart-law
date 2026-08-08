import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { EvaluationService, EvaluateRow } from '../../services/evaluation.service';

@Component({
  selector: 'app-result-test-page',
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    FormsModule,
    MatTooltipModule,
    MatMenuModule,
    MatChipsModule,
  ],
  templateUrl: './result-test-page.html',
  styleUrl: './result-test-page.scss',
})
export class ResultTestPage implements OnInit {
  isLoggedIn = false;

  k = 3;
  total = 0;
  correctCount = 0;
  precisionText = '';
  results: EvaluateRow[] = [];
  hasResult = false;

  constructor(
    private router: Router,
    private evaluationService: EvaluationService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';

    const last = this.evaluationService.lastResult;
    if (last) {
      this.hasResult = true;
      this.k = last.k;
      this.total = last.total;
      this.correctCount = last.correct_count;
      this.precisionText = `${last.precision_at_k.toFixed(2)} หรือ ${(
        last.precision_at_k * 100
      ).toFixed(0)}%`;
      this.results = last.results;
    }
  }

  // กลับหน้าหลัก
  goHome(): void {
    this.router.navigate(['/']);
  }

  // ไปหน้า Login
  goToLogin(): void {
    this.router.navigate(['/admin/login']);
  }

  // ไปหน้า Upload
  goToUpload(): void {
    this.router.navigate(['/upload']);
  }

  // ไปหน้าทดสอบ
  goToTest(): void {
    this.router.navigate(['/test']);
  }

  goToResult(): void {
    this.router.navigate(['/result']);
  }

  // Logout
  logout(): void {
    localStorage.removeItem('isAdminLoggedIn');
    this.isLoggedIn = false;
    this.router.navigate(['/']);
  }
}