import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upload-page',
  imports: [ CommonModule,MatToolbarModule, MatButtonModule, MatIconModule, MatCardModule, MatInputModule, FormsModule ],
  templateUrl: './upload-page.html',
  styleUrl: './upload-page.scss',
})
export class UploadPage {
  files = [
    'แพ่งและพาณิชย์.pdf',
    'แพ่งและพาณิชย์(ฉบับปรับปรุง).pdf',
  ];
}
