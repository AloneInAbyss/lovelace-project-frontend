import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../services/auth.service';
import { ForgotPassword } from './forgot-password';

describe('ForgotPassword', () => {
  let fixture: any;
  let component: ForgotPassword;
  let authSpy: any;
  let messageServiceSpy: any;
  let router: Router;

  beforeEach(async () => {
    authSpy = {
      sendPasswordResetEmail: jasmine
        .createSpy('sendPasswordResetEmail')
        .and.returnValue(Promise.resolve()),
    };
    messageServiceSpy = { add: jasmine.createSpy('add') };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule.withRoutes([]), ForgotPassword],
      providers: [
        provideZonelessChangeDetection(),
        { provide: AuthService, useValue: authSpy },
        { provide: MessageService, useValue: messageServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPassword);
    await fixture.whenStable();
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  });

  it('creates and has invalid form initially', () => {
    expect(component).toBeTruthy();
    expect(component.forgotForm.valid).toBeFalse();
  });

  it('form validates email field', () => {
    const f = component.forgotForm.controls;
    f['identity'].setValue('user@example.com');
    expect(component.forgotForm.valid).toBeTrue();
  });

  it('onSubmit does nothing when form is invalid', async () => {
    await component.onSubmit();
    expect(authSpy.sendPasswordResetEmail).not.toHaveBeenCalled();
  });

  it('onSubmit calls sendPasswordResetEmail and navigates on success', async () => {
    const f = component.forgotForm.controls;
    f['identity'].setValue('user@example.com');

    await component.onSubmit();

    expect(authSpy.sendPasswordResetEmail).toHaveBeenCalledWith('user@example.com');
    expect(messageServiceSpy.add).toHaveBeenCalledWith(
      jasmine.objectContaining({ severity: 'info' })
    );
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    expect(component.loading).toBeTrue();
  });

  it('onSubmit shows error message when sendPasswordResetEmail rejects', async () => {
    authSpy.sendPasswordResetEmail.and.returnValue(Promise.reject(new Error('fail')));
    const f = component.forgotForm.controls;
    f['identity'].setValue('user@example.com');

    await component.onSubmit();

    expect(messageServiceSpy.add).toHaveBeenCalledWith(
      jasmine.objectContaining({ severity: 'error' })
    );
  });
});
