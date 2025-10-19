import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../services/auth.service';
import { RegisterPage } from './register.page';

describe('RegisterPage', () => {
  let fixture: any;
  let component: RegisterPage;
  let authSpy: any;
  let messageServiceSpy: any;
  let router: Router;

  beforeEach(async () => {
    authSpy = { register: jasmine.createSpy('register').and.returnValue(Promise.resolve()) };
    messageServiceSpy = { add: jasmine.createSpy('add') };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule.withRoutes([]), RegisterPage],
      providers: [
        provideZonelessChangeDetection(),
        { provide: AuthService, useValue: authSpy },
        { provide: MessageService, useValue: messageServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterPage);
    await fixture.whenStable();
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  });

  it('creates and has invalid form initially', () => {
    expect(component).toBeTruthy();
    expect(component.registerForm.valid).toBeFalse();
  });

  it('form validates email, username and password', () => {
    const f = component.registerForm.controls;
    f['email'].setValue('user@example.com');
    f['username'].setValue('validuser');
    f['password'].setValue('secret123');
    f['passwordConfirm'].setValue('secret123');
    expect(component.registerForm.valid).toBeTrue();
  });

  it('onSubmit does nothing when form is invalid', async () => {
    await component.onSubmit();
    expect(authSpy.register).not.toHaveBeenCalled();
  });

  it('onSubmit calls auth.register and navigates on success', async () => {
    const f = component.registerForm.controls;
    f['email'].setValue('user@example.com');
    f['username'].setValue('validuser');
    f['password'].setValue('secret123');
    f['passwordConfirm'].setValue('secret123');

    await component.onSubmit();

    expect(authSpy.register).toHaveBeenCalledWith('user@example.com', 'validuser', 'secret123');
    expect(messageServiceSpy.add).toHaveBeenCalledWith(
      jasmine.objectContaining({ severity: 'info' })
    );
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    expect(component.loading).toBeTrue();
  });

  it('onSubmit shows error message when register rejects', async () => {
    authSpy.register.and.returnValue(Promise.reject(new Error('fail')));
    const f = component.registerForm.controls;
    f['email'].setValue('user@example.com');
    f['username'].setValue('validuser');
    f['password'].setValue('secret123');
    f['passwordConfirm'].setValue('secret123');

    await component.onSubmit();

    expect(messageServiceSpy.add).toHaveBeenCalledWith(
      jasmine.objectContaining({ severity: 'error' })
    );
  });
});
