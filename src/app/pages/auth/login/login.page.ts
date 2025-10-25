import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../../services/auth.service';
import { Header } from '../header/header';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
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
  styleUrl: './login.page.css',
  templateUrl: './login.page.html',
})
export class LoginPage {
  loginForm: FormGroup;
  loading = false;
  private returnUrl: string = '/';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.loginForm = this.fb.group({
      identity: ['', [Validators.required, Validators.maxLength(254)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(64)]],
    });

    // Get return URL from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get f() {
    return this.loginForm.controls as { [key: string]: any };
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    try {
      await this.auth.login(this.f['identity'].value, this.f['password'].value);

      this.messageService.add({
        severity: 'success',
        summary: 'Login',
        detail: `Login realizado com sucesso.`,
      });

      this.router.navigate([this.returnUrl]);
    } catch (error: any) {
      if (error?.cause === 'Email Not Verified') {
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          detail: error?.message,
        });
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail:
            error?.message ||
            'Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.',
        });
      }

      this.loading = false;
    }
  }
}
