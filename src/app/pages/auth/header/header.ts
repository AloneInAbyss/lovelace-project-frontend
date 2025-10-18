import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterModule],
  standalone: true,
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header {}
