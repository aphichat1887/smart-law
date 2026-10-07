// src/app/app.routes.ts
import { Routes } from '@angular/router';
 
import { Main } from './pages/main/main';
import { LoginPage } from './pages/login/login';
import { UploadPage } from './pages/upload-page/upload-page';
import { TestPage } from './pages/test-page/test-page';
import { ResultTestPage } from './pages/result-test-page/result-test-page';
import { ManageAdmins } from './pages/manage-admins/manage-admins';
import { adminGuard, superAdminGuard } from './guards/auth.guard';
 
export const routes: Routes = [
  { path: '', component: Main },
  { path: 'admin/login', component: LoginPage },
  { path: 'upload', component: UploadPage, canActivate: [adminGuard] },
  { path: 'test', component: TestPage, canActivate: [adminGuard] },
  { path: 'result', component: ResultTestPage, canActivate: [adminGuard] },
  { path: 'manage-admins', component: ManageAdmins, canActivate: [superAdminGuard] },
];