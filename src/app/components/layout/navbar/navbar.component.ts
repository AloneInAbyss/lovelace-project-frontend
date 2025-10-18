import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ButtonModule, ButtonSeverity } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';

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
  isLoggedIn = false; // placeholder: real auth should set this

  private sub?: Subscription;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // initialize current url (strip query/hash)
    this.currentUrl = this.stripUrl(this.router.url || '/');

    // update on navigation end
    this.sub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        this.currentUrl = this.stripUrl(e.urlAfterRedirects || e.url);
      });
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
    // placeholder sign out behavior. Replace with real auth logic.
    this.isLoggedIn = false;
    this.router.navigate(['/']);
  }
}
