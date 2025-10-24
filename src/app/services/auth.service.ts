import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, firstValueFrom, map, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthResponse, ErrorResponse, RegisterRequest } from '../models/auth.models';

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
  register(email: string, username: string, password: string): Promise<AuthResponse> {
    const request: RegisterRequest = { email, username, password };

    return firstValueFrom(
      this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, request).pipe(
        catchError(this.handleError)
      )
    );
  }

  // Login
  login(identity: string, password: string): Promise<AuthResponse> {
    return firstValueFrom(
      this.http.post<AuthResponse>(
        `${this.apiUrl}/auth/login`,
        { identity, password },
        { withCredentials: true } // Important for cookies
      ).pipe(
        map((response) => {
          this.saveAuthState(response);
          return response;
        }),
        catchError(this.handleError)
      )
    );
  }

  // Logout
  logout(): Promise<void> {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      this.clearAuthState();
      return Promise.resolve();
    }

    return firstValueFrom(
      this.http.post<{ message: string }>(
        `${this.apiUrl}/auth/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      ).pipe(
        map(() => {
          this.clearAuthState();
        }),
        catchError((error) => {
          // Clear auth state even if logout fails
          this.clearAuthState();
          return throwError(() => error);
        })
      )
    );
  }

  // Send password reset email
  sendPasswordResetEmail(email: string): Promise<void> {
    return firstValueFrom(
      this.http.post<{ message: string }>(
        `${this.apiUrl}/auth/forgot-password`,
        { email }
      ).pipe(
        map(() => undefined),
        catchError(this.handleError)
      )
    );
  }

  // Handle HTTP errors
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.';

    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Backend returned an unsuccessful response code
      const errorResponse = error.error as ErrorResponse;

      if (errorResponse?.message) {
        errorMessage = errorResponse.message;
      } else if (errorResponse?.errors) {
        // Validation errors from backend
        const validationErrors = Object.values(errorResponse.errors).join(', ');
        errorMessage = validationErrors;
      } else if (error.status === 0) {
        errorMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão.';
      } else if (error.status === 401) {
        errorMessage = 'Credenciais inválidas.';
      } else if (error.status === 403) {
        errorMessage = 'Acesso negado.';
      } else if (error.status === 404) {
        errorMessage = 'Recurso não encontrado.';
      } else if (error.status >= 500) {
        errorMessage = 'Erro no servidor. Tente novamente mais tarde.';
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}
