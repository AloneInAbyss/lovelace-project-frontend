import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home.page';
import { WishlistPage } from './pages/wishlist/wishlist.page';
import { LoginPage } from './pages/auth/login/login.page';
import { RegisterPage } from './pages/auth/register/register.page';
import { ForgotPassword } from './pages/auth/forgot-password/forgot-password';

export const routes: Routes = [
	{ path: '', component: HomePage },
	{ path: 'wishlist', component: WishlistPage },
	{ path: 'login', component: LoginPage },
	{ path: 'forgot-password', component: ForgotPassword },
	{ path: 'register', component: RegisterPage },
	{ path: '**', redirectTo: '' },
];
