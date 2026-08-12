import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { AdminService, AdminItem } from '../../services/admin.service';

@Component({
  selector: 'app-manage-admins',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatChipsModule,
  ],
  templateUrl: './manage-admins.html',
  styleUrls: ['./manage-admins.scss'],
})
export class ManageAdmins implements OnInit {
  isLoggedIn = false;
  isSuperAdmin = false;

  admins: AdminItem[] = [];
  loadingList = false;

  newEmail = '';
  newPassword = '';
  creating = false;

  deletingEmail: string | null = null;

  constructor(
    private router: Router,
    private adminService: AdminService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
    this.isSuperAdmin = localStorage.getItem('adminRole') === 'super_admin';

    if (!this.isLoggedIn || !this.isSuperAdmin) {
      // ไม่ใช่ super_admin ห้ามอยู่หน้านี้ เด้งกลับหน้าหลัก
      this.router.navigate(['/']);
      return;
    }

    this.loadAdmins();
  }

  loadAdmins(): void {
    this.loadingList = true;
    this.adminService.listAdmins().subscribe({
      next: (admins) => {
        this.admins = admins;
        this.loadingList = false;
      },
      error: (err) => {
        this.loadingList = false;
        this.snackBar.open(err?.error?.detail ?? 'โหลดรายชื่อ admin ไม่สำเร็จ', 'ปิด', {
          duration: 4000,
        });
      },
    });
  }

  createAdmin(): void {
    if (!this.newEmail.trim() || !this.newPassword.trim()) {
      this.snackBar.open('กรุณากรอกอีเมลและรหัสผ่านให้ครบ', 'ปิด', { duration: 3000 });
      return;
    }

    this.creating = true;
    this.adminService.createAdmin(this.newEmail.trim(), this.newPassword).subscribe({
      next: (res) => {
        this.creating = false;
        this.newEmail = '';
        this.newPassword = '';
        this.snackBar.open(`สร้าง admin "${res.email}" สำเร็จ`, 'ปิด', { duration: 3000 });
        this.loadAdmins();
      },
      error: (err) => {
        this.creating = false;
        this.snackBar.open(err?.error?.detail ?? 'สร้าง admin ไม่สำเร็จ', 'ปิด', {
          duration: 4000,
        });
      },
    });
  }

  deleteAdmin(email: string): void {
    this.deletingEmail = email;
    this.adminService.deleteAdmin(email).subscribe({
      next: () => {
        this.deletingEmail = null;
        this.snackBar.open(`ลบ "${email}" แล้ว`, 'ปิด', { duration: 3000 });
        this.loadAdmins();
      },
      error: (err) => {
        this.deletingEmail = null;
        this.snackBar.open(err?.error?.detail ?? 'ลบไม่สำเร็จ', 'ปิด', { duration: 4000 });
      },
    });
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  logout(): void {
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminRole');
    this.router.navigate(['/']);
  }
}
