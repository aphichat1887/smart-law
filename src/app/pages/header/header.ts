import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  isLoggedIn = false;
  isSuperAdmin = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.isLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
    this.isSuperAdmin = localStorage.getItem('adminRole') === 'super_admin';
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
