import { Routes } from '@angular/router';
import { Main  } from './pages/main/main';
import { LoginPage} from './pages/login/login';
import { UploadPage } from './pages/upload-page/upload-page';
import { ResultTestPage } from './pages/result-test-page/result-test-page';
import { TestPage } from './pages/test-page/test-page';


export const routes: Routes = [
    { path: '', component: Main },
    { path: 'admin/login', component: LoginPage },
    { path: 'upload', component: UploadPage },
    { path: 'result', component: ResultTestPage },
    { path: 'test', component: TestPage },
];
