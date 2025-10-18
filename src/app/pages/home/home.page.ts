import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `<main class="p-4"> <h1 class="text-2xl font-semibold">Home</h1> <p>Welcome to Lovelace Project.</p> </main>`,
})
export class HomePage {}
