import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule],
  template: `
    <main class="p-4 max-w-md mx-auto">
      <h1 class="text-2xl font-semibold mb-4">Registrar</h1>
      <p class="mb-2">(This is a placeholder registration page.)</p>
      <p-button label="Simulate Register"></p-button>
    </main>
  `,
})
export class RegisterPage {}
