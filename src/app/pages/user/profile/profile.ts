import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { FloatLabelModule } from 'primeng/floatlabel';

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
  changePasswordForm: any;
  mailSettingsForm: any;

  showDeleteConfirm = false;

  constructor(fb: FormBuilder) {
    this.fb = fb;
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(64)]],
      confirmPassword: ['', Validators.required],
    });

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

  submitPassword() {
    if (this.changePasswordForm.invalid) return;
    // mock submit
    console.log('Change password', this.changePasswordForm.value);
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
