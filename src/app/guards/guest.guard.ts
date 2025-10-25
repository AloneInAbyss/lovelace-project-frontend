import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs';

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn$.pipe(
    map(isLoggedIn => {
      if (!isLoggedIn) {
        // User is not logged in, allow access to auth pages
        return true;
      } else {
        // User is already logged in, redirect to home
        router.navigate(['/']);
        return false;
      }
    })
  );
};
