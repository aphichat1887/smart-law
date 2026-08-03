import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-result-test-page',
  imports: [ CommonModule, MatToolbarModule, MatButtonModule, MatIconModule, MatCardModule, MatInputModule, FormsModule ],
  templateUrl: './result-test-page.html',
  styleUrl: './result-test-page.scss',
})
export class ResultTestPage {
  results = [
    { text: 'ข้อความที่ 1', actual: 'ถูกต้อง', predicted: 'ถูกต้อง' },
    { text: 'ข้อความที่ 2', actual: 'ไม่ถูกต้อง', predicted: 'ถูกต้อง' },
    { text: 'ข้อความที่ 3', actual: 'ถูกต้อง', predicted: 'ถูกต้อง' },
    { text: 'ข้อความที่ 4', actual: 'ถูกต้อง', predicted: 'ไม่ถูกต้อง' },
  ];
}
