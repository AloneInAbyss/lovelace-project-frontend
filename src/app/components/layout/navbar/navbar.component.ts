import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ButtonModule, ButtonSeverity } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { AuthService } from '../../../services/auth.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    InputTextModule,
    InputGroupModule,
    InputGroupAddon,
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  currentUrl = '/';
  isLoggedIn = false; // driven by AuthService

  private sub?: Subscription;

  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit(): void {
    // initialize current url (strip query/hash)
    this.currentUrl = this.stripUrl(this.router.url || '/');

    // update on navigation end
    this.sub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        this.currentUrl = this.stripUrl(e.urlAfterRedirects || e.url);
      });

    // subscribe to auth state
    this.auth.isLoggedIn$.pipe(tap((v) => (this.isLoggedIn = v))).subscribe();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private stripUrl(url: string) {
    return url.split('?')[0].split('#')[0] || '/';
  }

  getButtonSeverity(path: string): ButtonSeverity {
    if (path === '/') {
      return (this.currentUrl === '/' ? 'primary' : 'secondary') as ButtonSeverity;
    }
    return (this.currentUrl.startsWith(path) ? 'primary' : 'secondary') as ButtonSeverity;
  }

  signOut(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
