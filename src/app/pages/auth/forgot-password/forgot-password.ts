import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../../services/auth.service';
import { Header } from '../header/header';

@Component({
  selector: 'app-forgot-password',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ButtonModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    Header,
  ],
  standalone: true,
  templateUrl: './forgot-password.html',
})
export class ForgotPassword {
  forgotForm: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.forgotForm = this.fb.group({
      identity: ['', [Validators.required, Validators.email]],
    });
  }

  get f() {
    return this.forgotForm.controls as { [key: string]: any };
  }

  onSubmit() {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    // TODO: Implement forgot password logic (send reset email)
    alert(`Forgot password requested for: ${this.forgotForm.value.identity}`);
  }
}
