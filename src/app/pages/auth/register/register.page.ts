import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { Header } from "../header/header";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, InputGroupModule, InputGroupAddonModule, InputTextModule, Header, RouterModule],
  templateUrl: './register.page.html',
})
export class RegisterPage {
  email = '';
  username = '';
  password = '';
  passwordConfirm = '';

  constructor(private auth: AuthService, private router: Router) {}

  simulateRegister() {
    if (this.password !== this.passwordConfirm) {
      alert('Passwords do not match');
      return;
    }

    // TODO: In a real app, call registration API and only login after success.
    this.auth.login();
    this.router.navigate(['/login']);
  }
}
