import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminService, AdminItem } from '../../services/admin.service';
import { Header } from '../header/header';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule,
    MatSnackBarModule, Header],
  templateUrl: './change-password.html',
  styleUrls: ['./change-password.scss'],
})
export class ChangePassword implements OnInit {
  email = '';
  isSuperAdmin = false;

  admins: AdminItem[] = [];   // ใช้เฉพาะ super admin
  targetEmail = '';

  oldPassword = '';
  newPassword = '';
  confirmPassword = '';
  saving = false;

  constructor(private router: Router, private adminService: AdminService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
    this.email = localStorage.getItem('adminEmail') ?? ''; // ต้องตรงกับ key ที่หน้า login เก็บ
    this.isSuperAdmin = localStorage.getItem('adminRole') === 'super_admin';

    if (!isLoggedIn || !this.email) {
      this.router.navigate(['/']);
      return;
    }
    if (this.isSuperAdmin) this.loadAdmins();
  }

  loadAdmins(): void {
    this.adminService.listAdmins().subscribe({
      next: (list) => (this.admins = list.filter((a) => a.role !== 'super_admin')),
      error: (err) =>
        this.snackBar.open(err?.error?.detail ?? 'โหลดรายชื่อ admin ไม่สำเร็จ', 'ปิด', { duration: 4000 }),
    });
  }

  submit(): void {
    if (this.isSuperAdmin ? !this.targetEmail : !this.oldPassword) {
      this.snackBar.open('กรุณากรอกให้ครบ', 'ปิด', { duration: 3000 });
      return;
    }
    if (this.newPassword.length < 6) {
      this.snackBar.open('รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร', 'ปิด', { duration: 3000 });
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.snackBar.open('ยืนยันรหัสผ่านไม่ตรงกัน', 'ปิด', { duration: 3000 });
      return;
    }

    this.saving = true;
    const req$ = this.isSuperAdmin
      ? this.adminService.resetPassword(this.email, this.targetEmail, this.newPassword)
      : (this.adminService as any).changePassword(this.email, this.oldPassword, this.newPassword);

    req$.subscribe({
      next: () => {
        this.saving = false;
        this.oldPassword = this.newPassword = this.confirmPassword = '';
        this.targetEmail = '';
        this.snackBar.open('เปลี่ยนรหัสผ่านสำเร็จ', 'ปิด', { duration: 3000 });
      },
      error: (err: HttpErrorResponse) => {
        this.saving = false;
        this.snackBar.open(err?.error?.detail ?? 'เปลี่ยนรหัสผ่านไม่สำเร็จ', 'ปิด', { duration: 4000 });
      },
    });
  }
}