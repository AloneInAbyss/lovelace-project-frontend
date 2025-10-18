import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputGroupModule, InputGroupAddonModule, InputTextModule, Header, RouterModule],
  templateUrl: './register.page.html',
})
export class RegisterPage {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(24)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(64)]],
      passwordConfirm: ['', [Validators.required]],
    }, { validators: this.passwordsMatchValidator });
  }

  get f() {
    return this.registerForm.controls as { [key: string]: any };
  }

  passwordsMatchValidator(group: FormGroup) {
    const pw = group.get('password')?.value;
    const pwc = group.get('passwordConfirm')?.value;
    return pw && pwc && pw === pwc ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    // Simulate registration success and log the user in for now.
    this.auth.login();
    this.router.navigate(['/login']);
  }
}
