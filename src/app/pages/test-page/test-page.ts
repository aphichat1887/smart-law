import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-test-page',
  imports: [ MatToolbarModule, MatButtonModule, MatIconModule, MatCardModule, MatInputModule, FormsModule ],
  templateUrl: './test-page.html',
  styleUrl: './test-page.scss',
})
export class TestPage {

}
