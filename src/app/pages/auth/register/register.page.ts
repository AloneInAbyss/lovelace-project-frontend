import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../../services/auth.service';
import { Header } from '../header/header';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    Header,
    RouterModule,
  ],
  styleUrl: './register.page.css',
  templateUrl: './register.page.html',
})
export class RegisterPage {
  registerForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.registerForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(24), Validators.pattern(/^[a-zA-Z0-9_-]+$/)]],
        password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(64)]],
        passwordConfirm: ['', [Validators.required]],
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  get f() {
    return this.registerForm.controls as { [key: string]: any };
  }

  passwordsMatchValidator(group: FormGroup) {
    const pw = group.get('password')?.value;
    const pwc = group.get('passwordConfirm')?.value;
    return pw && pwc && pw === pwc ? null : { passwordMismatch: true };
  }

  async onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    try {
      const response = await this.auth.register(
        this.f['email'].value,
        this.f['username'].value,
        this.f['password'].value
      );

      // Show success message from backend or default message
      const message = response.message || 'Acesse o link de verificação enviado para seu email para ativar sua conta.';

      this.messageService.add({
        severity: 'info',
        summary: 'Registro',
        detail: message,
        life: 15000,
      });

      this.router.navigate(['/login']);
    } catch (error: any) {
      const errorMessage = error?.message || 'Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.';

      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: errorMessage,
      });

      this.loading = false;
    }
  }
}
