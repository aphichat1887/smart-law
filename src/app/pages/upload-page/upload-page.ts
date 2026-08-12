import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FileService, FileItem } from '../../services/file.service';

@Component({
  selector: 'app-upload-page',
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
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './upload-page.html',
  styleUrl: './upload-page.scss',
})
export class UploadPage implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  isLoggedIn = false;
  isSuperAdmin = false;
  files: FileItem[] = [];
  loadingList = false;
  uploading = false;
  deletingFilename: string | null = null;

  constructor(
    private router: Router,
    private fileService: FileService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';

    this.isSuperAdmin =
      localStorage.getItem('adminRole') === 'super_admin';
    this.loadFiles();
  }

  loadFiles(): void {
    this.loadingList = true;
    this.fileService.listFiles().subscribe({
      next: (files) => {
        this.files = files;
        this.loadingList = false;
      },
      error: () => {
        this.loadingList = false;
        this.snackBar.open('โหลดรายชื่อไฟล์ไม่สำเร็จ', 'ปิด', { duration: 3000 });
      },
    });
  }

  // เรียกตอนกดปุ่ม Upload -> เปิด file picker ของเบราว์เซอร์
  openFilePicker(): void {
    this.fileInput.nativeElement.click();
  }

  // เรียกเมื่อผู้ใช้เลือกไฟล์จาก file picker แล้ว
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      this.snackBar.open('รองรับเฉพาะไฟล์ .pdf เท่านั้น', 'ปิด', { duration: 3000 });
      input.value = '';
      return;
    }

    this.uploading = true;
    this.fileService.uploadFile(file).subscribe({
      next: (res) => {
        this.uploading = false;
        input.value = ''; // เคลียร์ค่า input ไว้ เผื่ออัปโหลดไฟล์ชื่อเดิมซ้ำอีกครั้ง
        this.snackBar.open(
          `อัปโหลดสำเร็จ: เพิ่ม ${res.articles_added} มาตราจาก "${res.filename}"`,
          'ปิด',
          { duration: 4000 }
        );
        this.loadFiles();
      },
      error: (err) => {
        this.uploading = false;
        input.value = '';
        const msg = err?.error?.detail ?? err.message ?? 'อัปโหลดไม่สำเร็จ';
        this.snackBar.open(msg, 'ปิด', { duration: 5000 });
      },
    });
  }

  deleteFile(filename: string): void {
    this.deletingFilename = filename;
    this.fileService.deleteFile(filename).subscribe({
      next: (res) => {
        this.deletingFilename = null;
        this.snackBar.open(
          `ลบ "${res.filename}" แล้ว (เอา ${res.articles_removed} มาตราออก)`,
          'ปิด',
          { duration: 4000 }
        );
        this.loadFiles();
      },
      error: (err) => {
        this.deletingFilename = null;
        const msg = err?.error?.detail ?? err.message ?? 'ลบไฟล์ไม่สำเร็จ';
        this.snackBar.open(msg, 'ปิด', { duration: 4000 });
      },
    });
  }

  // กลับหน้าหลัก
  goHome(): void {
    this.router.navigate(['/']);
  }

  // ไปหน้า Login
  goToLogin(): void {
    this.router.navigate(['/admin/login']);
  }

  // ไปหน้า Upload (อยู่หน้านี้แล้ว เผื่อเรียกจากเมนู)
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
