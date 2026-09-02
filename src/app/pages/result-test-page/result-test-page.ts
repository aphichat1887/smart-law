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
  isSuperAdmin = false;

  k = 3;
  total = 0;
  correctCount = 0;
  recallText = '';
  hitText = '';
  mrrText = '';
  results: EvaluateRow[] = [];
  hasResult = false;

  constructor(
    private router: Router,
    private evaluationService: EvaluationService
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';

    this.isSuperAdmin =
      localStorage.getItem('adminRole') === 'super_admin';

    const last = this.evaluationService.lastResult;
    if (last) {
      this.hasResult = true;
      this.k = last.k;
      this.total = last.total;
      this.correctCount = last.correct_count;
      this.recallText = this.formatMetric(last.recall_at_k);
      this.hitText = this.formatMetric(last.hit_at_k);
      this.mrrText = this.formatMetric(last.mrr);
      this.results = last.results;
    }
  }

  private formatMetric(value: number): string {
    return `${value.toFixed(2)} หรือ ${(value * 100).toFixed(0)}%`;
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

  goToManageAdmins(): void {
    this.router.navigate(['/manage-admins']);
  }

  goToResult(): void {
    this.router.navigate(['/result']);
  }

  // Logout
  logout(): void {
    localStorage.removeItem('isAdminLoggedIn');

    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminRole');
    this.isLoggedIn = false;
    this.isSuperAdmin = false;
    this.router.navigate(['/']);
  }
}