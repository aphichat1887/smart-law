// src/app/pages/login/login.ts
// วางไฟล์นี้ที่ src/app/pages/login/login.ts
// ปรับ import path ของ SearchService/AuthService ให้ตรงกับโปรเจกต์จริง

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class LoginPage {
  email = '';
  password = '';
  showPassword = false;
  loading = false;
  error = '';

  // ⚠️ รหัสชั่วคราวสำหรับทดสอบเท่านั้น — ห้ามใช้แบบนี้ตอนขึ้น production จริง
  // เพราะใครก็เปิด devtools ดู source code แล้วเห็น username/password ได้เลย
  // ทดแทนด้วยการเรียก backend API จริงทันทีที่มี auth endpoint พร้อม
  private readonly TEMP_USERNAME = 'admin';
  private readonly TEMP_PASSWORD = '1';

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  login(): void {

    if (!this.email.trim() || !this.password.trim()) {
      this.error = 'กรุณากรอกอีเมลและรหัสผ่านให้ครบ';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login(
      this.email.trim(),
      this.password
    ).subscribe({

      next: (res) => {

        this.loading = false;

        if (res.success) {

          localStorage.setItem(
            'isAdminLoggedIn',
            'true'
          );

          localStorage.setItem(
            'adminEmail',
            res.email
          );

          this.router.navigate(['/']);

        }

      },

      error: (err) => {

        this.loading = false;

        if (err.status === 401) {

          this.error =
            'อีเมลหรือรหัสผ่านไม่ถูกต้อง';

        } else {

          this.error =
            'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้';

        }

      }

    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}