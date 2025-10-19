import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../services/auth.service';
import { LoginPage } from './login.page';

describe('LoginPage', () => {
  let fixture: any;
  let component: LoginPage;
  let authSpy: any;
  let messageServiceSpy: any;
  let router: Router;

  beforeEach(async () => {
    authSpy = { login: jasmine.createSpy('login').and.returnValue(Promise.resolve()) };
    messageServiceSpy = { add: jasmine.createSpy('add') };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule.withRoutes([]), LoginPage],
      providers: [
        provideZonelessChangeDetection(),
        { provide: AuthService, useValue: authSpy },
        { provide: MessageService, useValue: messageServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    await fixture.whenStable();
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  });

  it('creates and has invalid form initially', () => {
    expect(component).toBeTruthy();
    expect(component.loginForm.valid).toBeFalse();
  });

  it('form validates identity and password', () => {
    const f = component.loginForm.controls;
    f['identity'].setValue('user@example.com');
    f['password'].setValue('secret123');
    expect(component.loginForm.valid).toBeTrue();
  });

  it('onSubmit does nothing when form is invalid', async () => {
    // leave form empty
    await component.onSubmit();
    expect(authSpy.login).not.toHaveBeenCalled();
  });

  it('onSubmit calls auth.login and navigates on success', async () => {
    const f = component.loginForm.controls;
    f['identity'].setValue('user@example.com');
    f['password'].setValue('secret123');

    await component.onSubmit();

    expect(authSpy.login).toHaveBeenCalledWith('user@example.com', 'secret123');
    expect(messageServiceSpy.add).toHaveBeenCalledWith(
      jasmine.objectContaining({ severity: 'success' })
    );
    expect(router.navigate).toHaveBeenCalledWith(['/']);
    expect(component.loading).toBeTrue();
  });

  it('onSubmit shows error message when auth.login rejects', async () => {
    authSpy.login.and.returnValue(Promise.reject(new Error('fail')));
    const f = component.loginForm.controls;
    f['identity'].setValue('user@example.com');
    f['password'].setValue('secret123');

    await component.onSubmit();

    expect(messageServiceSpy.add).toHaveBeenCalledWith(
      jasmine.objectContaining({ severity: 'error' })
    );
  });
});
