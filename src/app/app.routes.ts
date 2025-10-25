import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home.page';
import { LoginPage } from './pages/auth/login/login.page';
import { RegisterPage } from './pages/auth/register/register.page';
import { ForgotPassword } from './pages/auth/forgot-password/forgot-password';
import { GameDetails } from './pages/games/game-details';
import { Wishlist } from './pages/user/wishlist/wishlist';
import { Profile } from './pages/user/profile/profile';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
	{ path: '', component: HomePage },
	{ path: 'game/:id', component: GameDetails },
	{ path: 'wishlist', component: Wishlist, canActivate: [authGuard] },
	{ path: 'profile', component: Profile, canActivate: [authGuard] },
	{ path: 'login', component: LoginPage },
	{ path: 'forgot-password', component: ForgotPassword },
	{ path: 'register', component: RegisterPage },
	{ path: '**', redirectTo: '' },
];
