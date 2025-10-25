import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home.page';
import { LoginPage } from './pages/auth/login/login.page';
import { RegisterPage } from './pages/auth/register/register.page';
import { ForgotPassword } from './pages/auth/forgot-password/forgot-password';
import { ResetPassword } from './pages/auth/reset-password/reset-password';
import { GameDetails } from './pages/games/game-details';
import { Wishlist } from './pages/user/wishlist/wishlist';
import { Profile } from './pages/user/profile/profile';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';

export const routes: Routes = [
  // Public routes
	{ path: '', component: HomePage },
	{ path: 'verify-email', component: HomePage, data: { verifyEmail: true } },
	{ path: 'game/:id', component: GameDetails },

  // Auth guarded routes
	{ path: 'wishlist', component: Wishlist, canActivate: [authGuard] },
	{ path: 'profile', component: Profile, canActivate: [authGuard] },

  // Guest guarded routes
	{ path: 'login', component: LoginPage, canActivate: [guestGuard] },
	{ path: 'register', component: RegisterPage, canActivate: [guestGuard] },
	{ path: 'forgot-password', component: ForgotPassword, canActivate: [guestGuard] },
	{ path: 'reset-password', component: ResetPassword, canActivate: [guestGuard] },

  // Wildcard route
	{ path: '**', redirectTo: '' },
];
