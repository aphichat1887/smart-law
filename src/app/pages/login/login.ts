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
  username = '';
  password = '';
  showPassword = false;
  loading = false;
  error = '';

  // ⚠️ รหัสชั่วคราวสำหรับทดสอบเท่านั้น — ห้ามใช้แบบนี้ตอนขึ้น production จริง
  // เพราะใครก็เปิด devtools ดู source code แล้วเห็น username/password ได้เลย
  // ทดแทนด้วยการเรียก backend API จริงทันทีที่มี auth endpoint พร้อม
  private readonly TEMP_USERNAME = 'admin';
  private readonly TEMP_PASSWORD = '1';

  constructor(private router: Router) {}

  login(): void {
    if (!this.username.trim() || !this.password.trim()) {
      this.error = 'กรุณากรอก username และ password ให้ครบ';
      return;
    }

    this.loading = true;
    this.error = '';

    // TODO: เปลี่ยนตรงนี้ให้เรียก backend จริง เช่น
    // this.authService.login(this.username, this.password).subscribe({
    //   next: () => this.router.navigate(['/admin']),
    //   error: () => { this.error = 'username หรือ password ไม่ถูกต้อง'; this.loading = false; }
    // });

    setTimeout(() => {
      this.loading = false;

      if (this.username === this.TEMP_USERNAME && this.password === this.TEMP_PASSWORD) {
        // เก็บสถานะล็อกอินแบบง่ายๆ ไว้ก่อน (ชั่วคราว ยังไม่ใช่ token จริง)
        localStorage.setItem('isAdminLoggedIn', 'true');
        this.router.navigate(['/']);
      } else {
        this.error = 'username หรือ password ไม่ถูกต้อง';
      }
    }, 500);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}