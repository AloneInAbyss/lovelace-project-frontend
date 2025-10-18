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
    this._loggedIn.next(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('User logged in');
        resolve();
      }, 2000);
    });
  }

  // simulate registration
  register(): void {
    this._loggedIn.next(true);
  }

  // simulate logout
  logout(): void {
    this._loggedIn.next(false);
  }

  // simulate password reset email
  sendPasswordResetEmail(email: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Sending password reset email to ${email}`);
        resolve();
      }, 2000);
    });
  }
}
