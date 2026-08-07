import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';

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
    MatMenuModule
  ],
  templateUrl: './result-test-page.html',
  styleUrl: './result-test-page.scss',
})
export class ResultTestPage implements OnInit {
  isLoggedIn = false;
  constructor(private router: Router) { }
  ngOnInit(): void {

    this.isLoggedIn =
      localStorage.getItem('isAdminLoggedIn') === 'true';

  }
  results = [
    { text: 'ข้อความที่ 1', actual: 'ถูกต้อง', predicted: 'ถูกต้อง' },
    { text: 'ข้อความที่ 2', actual: 'ไม่ถูกต้อง', predicted: 'ถูกต้อง' },
    { text: 'ข้อความที่ 3', actual: 'ถูกต้อง', predicted: 'ถูกต้อง' },
    { text: 'ข้อความที่ 4', actual: 'ถูกต้อง', predicted: 'ไม่ถูกต้อง' },
  ];

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
