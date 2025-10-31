import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, firstValueFrom, map, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthResponse, MessageResponse, RegisterResponse } from '../models/auth.response.model';
import { ChangePasswordRequest, ForgotPasswordRequest, LoginRequest, RegisterRequest, ResetPasswordRequest } from '../models/auth.request.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = environment.apiUrl;
  private _loggedIn = new BehaviorSubject<boolean>(false);
  private _currentUser = new BehaviorSubject<AuthResponse | null>(null);

  constructor(private http: HttpClient) {
    // Check if user is already logged in (e.g., from localStorage)
    this.checkAuthState();
  }

  get isLoggedIn$(): Observable<boolean> {
    return this._loggedIn.asObservable();
  }

  get currentUser$(): Observable<AuthResponse | null> {
    return this._currentUser.asObservable();
  }

  private checkAuthState(): void {
    const token = localStorage.getItem('accessToken');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this._currentUser.next(user);
        this._loggedIn.next(true);
      } catch (error) {
        this.clearAuthState();
      }
    }
  }

  private saveAuthState(authResponse: AuthResponse): void {
    localStorage.setItem('accessToken', authResponse.token);
    localStorage.setItem('user', JSON.stringify(authResponse));
    this._currentUser.next(authResponse);
    this._loggedIn.next(true);
  }

  private clearAuthState(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    this._currentUser.next(null);
    this._loggedIn.next(false);
  }

  // Register a new user
  register(email: string, username: string, password: string): Promise<RegisterResponse> {
    const request: RegisterRequest = { email, username, password };

    return firstValueFrom(
      this.http.post<RegisterResponse>(`${this.apiUrl}/auth/register`, request)
    );
  }

  // Login
  login(identity: string, password: string): Promise<AuthResponse> {
    const request: LoginRequest = { identity, password };
    return firstValueFrom(
      this.http.post<AuthResponse>(
        `${this.apiUrl}/auth/login`,
        request,
        { withCredentials: true } // Important for cookies
      ).pipe(
        map((response) => {
          this.saveAuthState(response);
          return response;
        })
      )
    );
  }

  // Logout
  logout(): Promise<MessageResponse> {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      this.clearAuthState();
      return Promise.resolve({ message: 'Token não encontrado' });
    }

    return firstValueFrom(
      this.http.post<MessageResponse>(
        `${this.apiUrl}/auth/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      ).pipe(
        map((response) => {
          this.clearAuthState();
          return response;
        }),
        catchError((error) => {
          // Clear auth state even if logout fails
          this.clearAuthState();
          return throwError(() => error);
        })
      )
    );
  }

  // Verify email with token
  verifyEmail(token: string): Promise<MessageResponse> {
    return firstValueFrom(
      this.http.get<MessageResponse>(
        `${this.apiUrl}/auth/verify-email?token=${token}`
      )
    );
  }

  // Send password reset email
  sendPasswordResetEmail(email: string): Promise<MessageResponse> {
    const request: ForgotPasswordRequest = { email };
    return firstValueFrom(
      this.http.post<MessageResponse>(
        `${this.apiUrl}/auth/forgot-password`,
        request
      )
    );
  }

  // Reset password with token
  resetPassword(token: string, newPassword: string): Promise<MessageResponse> {
    const request: ResetPasswordRequest = { token, newPassword };
    return firstValueFrom(
      this.http.post<MessageResponse>(
        `${this.apiUrl}/auth/reset-password`,
        request
      )
    );
  }

  // Change password (of an authenticated user)
  changePassword(currentPassword: string, newPassword: string): Promise<MessageResponse> {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      return Promise.reject(new Error('Usuário não autenticado.'));
    }

    const request: ChangePasswordRequest = { currentPassword, newPassword };
    return firstValueFrom(
      this.http.post<MessageResponse>(
        `${this.apiUrl}/auth/change-password`,
        request,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      ).pipe(
        map((response) => {
          // Clear auth state since user needs to log in again after password change
          this.clearAuthState();
          return response;
        })
      )
    );
  }
}
