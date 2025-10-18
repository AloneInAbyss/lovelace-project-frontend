import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../../services/auth.service';
import { Header } from "../header/header";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ButtonModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    Header
],
  templateUrl: './login.page.html',
})
export class LoginPage {
  identity = '';
  password = '';

  constructor(private auth: AuthService, private router: Router) {}

  simulateLogin() {
    // TODO: In a real app, call auth API. Here we simulate success.
    this.auth.login();
    this.router.navigate(['/']);
  }

  goToForgot(e: Event) {
    e.preventDefault();
    // TODO: implement forgot password flow. For now navigate to a placeholder or show an alert.
    alert('Forgot password flow not implemented yet.');
  }
}
