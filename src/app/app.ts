import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { NavbarComponent } from './layout/navbar/navbar.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('lovelace-project-frontend');

  showNavbar = true;
  private sub?: Subscription;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const url = this.router.url || '/';
    this.showNavbar = !this.isAuthRoute(url);

    this.sub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        this.showNavbar = !this.isAuthRoute(e.urlAfterRedirects || e.url);
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private isAuthRoute(url: string) {
    const path = (url || '/').split('?')[0].split('#')[0];
    return path === '/login' || path === '/register';
  }
}
