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
  selector: 'app-test-page',
  standalone: true,

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

  templateUrl: './test-page.html',
  styleUrl: './test-page.scss',
})
export class TestPage implements OnInit {

  isLoggedIn = false;

  constructor(private router: Router) { }

  ngOnInit(): void {

    this.isLoggedIn =
      localStorage.getItem('isAdminLoggedIn') === 'true';

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