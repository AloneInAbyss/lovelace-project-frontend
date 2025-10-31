import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { MenuModule } from 'primeng/menu';
import { MenuItem, MessageService } from 'primeng/api';
import { FloatLabelModule } from 'primeng/floatlabel';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    PanelModule,
    ConfirmDialogModule,
    DialogModule,
    MenuModule,
    FloatLabelModule
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  items: MenuItem[] = [];
  active = 'profile';

  fb!: FormBuilder;
  changePasswordForm: FormGroup;
  mailSettingsForm: any;

  showDeleteConfirm = false;
  loading = false;

  // Password match validator
  private passwordsMatchValidator(group: FormGroup) {
    const newPw = group.get('newPassword')?.value;
    const confirmPw = group.get('confirmPassword')?.value;
    return newPw && confirmPw && newPw === confirmPw ? null : { passwordMismatch: true };
  }

  constructor(
    fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.fb = fb;
    this.changePasswordForm = this.fb.group(
      {
        currentPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(64)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordsMatchValidator.bind(this) }
    );

    this.mailSettingsForm = this.fb.group({
      newsletter: [true],
    });

    this.items = [
      {
        label: 'Perfil',
        items: [
          { label: 'Mudar senha', icon: 'pi pi-key', command: () => this.select('profile') },
          {
            label: 'Configurações de email',
            icon: 'pi pi-envelope',
            command: () => this.select('mail'),
          },
          { label: 'Excluir Conta', icon: 'pi pi-trash', command: () => this.select('delete') },
        ],
      },
    ];
  }

  select(id: string) {
    this.active = id;
  }

  get f() {
    return this.changePasswordForm.controls as { [key: string]: any };
  }

  async submitPassword() {
    if (this.changePasswordForm.invalid) {
      this.changePasswordForm.markAllAsTouched();
      return;
    }

    const { currentPassword, newPassword } = this.changePasswordForm.value;

    this.loading = true;

    try {
      const response = await this.authService.changePassword(currentPassword, newPassword);

      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: response.message || 'Senha alterada com sucesso! Faça login novamente.'
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

  submitMail() {
    console.log('Mail settings', this.mailSettingsForm.value);
  }

  confirmDelete() {
    this.showDeleteConfirm = true;
  }

  deleteAccount() {
    this.showDeleteConfirm = false;
    console.log('Account deleted (mock)');
  }
}
