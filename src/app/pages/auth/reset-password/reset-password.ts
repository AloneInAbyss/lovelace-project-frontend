import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../../services/auth.service';
import { Header } from '../header/header';

@Component({
  selector: 'app-reset-password',
  standalone: true,
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
  styleUrl: './reset-password.css',
  templateUrl: './reset-password.html',
})
export class ResetPassword implements OnInit {
  resetForm: FormGroup;
  loading = false;
  token: string | null = null;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.resetForm = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(64)]],
        passwordConfirm: ['', [Validators.required]],
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  ngOnInit() {
    this.token = this.route.snapshot.queryParams['token'];

    if (!this.token) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Token de redefinição de senha não fornecido.',
      });
      this.router.navigate(['/login']);
    }
  }

  get f() {
    return this.resetForm.controls as { [key: string]: any };
  }

  passwordsMatchValidator(group: FormGroup) {
    const pw = group.get('password')?.value;
    const pwc = group.get('passwordConfirm')?.value;
    return pw && pwc && pw === pwc ? null : { passwordMismatch: true };
  }

  async onSubmit() {
    if (this.resetForm.invalid || !this.token) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    try {
      const response = await this.auth.resetPassword(this.token, this.f['password'].value);

      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: response.message || 'Senha redefinida com sucesso! Você pode fazer login agora.',
        life: 5000,
      });

      this.router.navigate(['/login']);
    } catch (error: any) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: error?.message || 'Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.',
      });

      this.loading = false;
    }
  }
}
