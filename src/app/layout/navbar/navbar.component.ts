import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { ButtonModule, ButtonSeverity } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { Menu } from 'primeng/menu';
import { Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

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
    Menu,
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  currentUrl = '/';
  isLoggedIn = false; // driven by AuthService

  private sub?: Subscription;

  items: MenuItem[] | undefined;

  constructor(
    private router: Router,
    private auth: AuthService,
    private messageService: MessageService
  ) {}

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

    // setup menu items
    this.items = [
      {
        label: 'Configurações',
        icon: 'pi pi-cog',
        routerLink: '/profile',
      },
      {
        label: 'Sair',
        icon: 'pi pi-sign-out',
        command: () => {
          this.signOut();
        },
      },
    ];
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

  private async signOut(): Promise<void> {
    try {
      await this.auth.logout();
      this.router.navigate(['/login']);
    } catch (error: any) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: error?.message || 'Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.',
      });
    }
  }
}
