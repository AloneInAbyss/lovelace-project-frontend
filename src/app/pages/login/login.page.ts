import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule],
  template: `
    <main class="p-4 max-w-md mx-auto">
      <h1 class="text-2xl font-semibold mb-4">Entrar</h1>
      <p class="mb-2">(This is a placeholder login page.)</p>
      <p-button label="Simulate Login" (click)="simulateLogin()"></p-button>
    </main>
  `,
})
export class LoginPage {
  constructor(private auth: AuthService, private router: Router) {}

  simulateLogin() {
    this.auth.login();
    this.router.navigate(['/']);
  }
}
