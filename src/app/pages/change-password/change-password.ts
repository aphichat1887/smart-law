import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminService } from '../../services/admin.service';
import { Header } from '../header/header';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatSnackBarModule, Header],
  templateUrl: './change-password.html',
  styleUrls: ['./change-password.scss'],
})
export class ChangePassword implements OnInit {
  email = '';
  oldPassword = '';
  newPassword = '';
  confirmPassword = '';
  saving = false;

  constructor(private router: Router, private adminService: AdminService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
    this.email = localStorage.getItem('adminEmail') ?? ''; // ต้องตรงกับ key ที่หน้า login เก็บไว้
    if (!isLoggedIn || !this.email) this.router.navigate(['/']);
  }

  submit(): void {
    if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
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
    this.adminService.changePassword(this.email, this.oldPassword, this.newPassword).subscribe({
      next: () => {
        this.saving = false;
        this.oldPassword = this.newPassword = this.confirmPassword = '';
        this.snackBar.open('เปลี่ยนรหัสผ่านสำเร็จ', 'ปิด', { duration: 3000 });
      },
      error: (err) => {
        this.saving = false;
        this.snackBar.open(err?.error?.detail ?? 'เปลี่ยนรหัสผ่านไม่สำเร็จ', 'ปิด', { duration: 4000 });
      },
    });
  }
}