// src/app/app.routes.ts
import { Routes } from '@angular/router';

import { Main } from './pages/main/main';
import { LoginPage } from './pages/login/login';
import { UploadPage } from './pages/upload-page/upload-page';
import { TestPage } from './pages/test-page/test-page';
import { ResultTestPage } from './pages/result-test-page/result-test-page';
import { ManageAdmins } from './pages/manage-admins/manage-admins';

export const routes: Routes = [
  { path: '', component: Main },
  { path: 'admin/login', component: LoginPage },
  { path: 'upload', component: UploadPage },
  { path: 'test', component: TestPage },
  { path: 'result', component: ResultTestPage },
  { path: 'manage-admins', component: ManageAdmins },
];
