import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // true when user is logged in
  private _loggedIn = new BehaviorSubject<boolean>(false);

  get isLoggedIn$(): Observable<boolean> {
    return this._loggedIn.asObservable();
  }

  // simulate login
  login(): void {
    this._loggedIn.next(true);
  }

  // simulate logout
  logout(): void {
    this._loggedIn.next(false);
  }
}
