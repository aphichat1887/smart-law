// src/app/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

// กันหน้าที่ login แล้วเท่านั้นถึงเข้าได้ (admin ธรรมดา หรือ super_admin ก็ได้)
// ใช้กับ: /upload, /test, /result
export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const isLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';

  if (isLoggedIn) {
    return true;
  }

  router.navigate(['/admin/login']);
  return false;
};

// กันหน้าที่ต้องเป็น super_admin เท่านั้นถึงเข้าได้
// ใช้กับ: /manage-admins
export const superAdminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const isLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
  const isSuperAdmin = localStorage.getItem('adminRole') === 'super_admin';

  if (isLoggedIn && isSuperAdmin) {
    return true;
  }

  router.navigate(['/']);
  return false;
};
