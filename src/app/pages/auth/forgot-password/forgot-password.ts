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
  styleUrl: './forgot-password.css',
  templateUrl: './forgot-password.html',
})
export class ForgotPassword {
  forgotForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.forgotForm = this.fb.group({
      identity: ['', [Validators.required, Validators.email]],
    });
  }

  get f() {
    return this.forgotForm.controls as { [key: string]: any };
  }

  async onSubmit() {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    try {
      await this.auth.sendPasswordResetEmail(this.f['identity'].value);

      this.messageService.add({
        severity: 'info',
        summary: 'Recuperação de Senha',
        detail: `Solicitação de recuperação de senha enviada com sucesso. Verifique seu e-mail.`,
        life: 5000,
      });

      this.router.navigate(['/login']);
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.',
      });

      setTimeout(() => {
        this.loading = false;
      }, 3000);
    }
  }
}
