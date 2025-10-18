import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _loggedIn = new BehaviorSubject<boolean>(false);

  get isLoggedIn$(): Observable<boolean> {
    return this._loggedIn.asObservable();
  }

  // simulate login
  login(identity: string, password: string): Promise<void> {
    // 50% chance to throw an error synchronously
    if (Math.random() < 0.5) {
      throw new Error('Login failed');
    }

    this._loggedIn.next(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('User logged in');
        resolve();
      }, 2000);
    });
  }

  // simulate registration
  register(email: string, username: string, password: string): Promise<void> {
    // 50% chance to throw an error synchronously
    if (Math.random() < 0.5) {
      throw new Error('Registration failed');
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('User registered');
        resolve();
      }, 2000);
    });
  }

  // simulate logout
  logout(): void {
    // 50% chance to throw an error synchronously
    if (Math.random() < 0.5) {
      throw new Error('Logout failed');
    }

    this._loggedIn.next(false);
  }

  // simulate password reset email
  sendPasswordResetEmail(email: string): Promise<void> {
    // 50% chance to throw an error synchronously
    if (Math.random() < 0.5) {
      throw new Error('Password reset failed');
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Sending password reset email to ${email}`);
        resolve();
      }, 2000);
    });
  }
}
