import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { ButtonModule, ButtonSeverity } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { Menu } from 'primeng/menu';
import { Observable, Subject, Subscription } from 'rxjs';
import { filter, tap, debounceTime, distinctUntilChanged, switchMap, map, finalize, takeUntil } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { GameService } from '../../services/game.service';
import { BoardGame } from '../../models/game.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
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
  private destroy$ = new Subject<void>();

  items: MenuItem[] | undefined;

  // Search functionality
  searchControl = new FormControl<string | null>('');
  results: BoardGame[] = [];
  loading = false;
  showDropdown = false;
  private searchTerm$ = new Subject<string>();
  private currentQuery = '';

  constructor(
    private router: Router,
    private auth: AuthService,
    private messageService: MessageService,
    private gameService: GameService,
    private cdr: ChangeDetectorRef
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
        label: $localize`Configurações`,
        icon: 'pi pi-cog',
        routerLink: '/profile',
      },
      {
        label: $localize`Sair`,
        icon: 'pi pi-sign-out',
        command: () => {
          this.signOut();
        },
      },
    ];

    // Setup search
    this.setupSearch();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
    this.searchTerm$.complete();
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
        summary: $localize`Erro`,
        detail: error?.message || $localize`Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.`,
      });
    }
  }

  // Search functionality
  private scheduleDetectChanges() {
    Promise.resolve().then(() => this.cdr.detectChanges());
  }

  setupSearch() {
    this.searchTerm$
      .pipe(
        map((s: string | null) => (s ?? '').trim()),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((q: string) => {
          this.currentQuery = q;
          if (!q) {
            this.results = [];
            this.currentQuery = '';
            this.showDropdown = false;
            this.loading = false;
            this.scheduleDetectChanges();
            return new Observable<BoardGame[]>((observer) => {
              observer.next([]);
              observer.complete();
            });
          }

          this.loading = true;
          this.scheduleDetectChanges();

          return this.search(q).pipe(finalize(() => (this.loading = false)));
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (res) => {
          this.results = res;
          this.showDropdown = this.currentQuery.trim().length > 0;
          this.scheduleDetectChanges();
        },
        error: () => {
          this.results = [];
          this.loading = false;
          this.showDropdown = false;
          this.scheduleDetectChanges();
        },
      });
  }

  private search(q: string): Observable<BoardGame[]> {
    return new Observable<BoardGame[]>((observer) => {
      this.gameService
        .searchGames(q, 0, 5)
        .then((response) => {
          observer.next(response.content);
          observer.complete();
        })
        .catch((error) => {
          console.error('Error searching games:', error);
          observer.error(error);
        });
    });
  }

  navigateToGame(g: BoardGame) {
    this.showDropdown = false;
    this.searchControl.setValue('');
    this.results = [];
    
    // Navigate to the game page
    this.router.navigate(['/game', g.id]).then(() => {
      // Reload the page to ensure fresh data
      window.location.reload();
    });
  }

  clear() {
    this.searchControl.setValue('');
    this.results = [];
    this.showDropdown = false;
    this.loading = false;
    this.searchTerm$.next('');
    this.scheduleDetectChanges();
  }

  onInput(value: string) {
    this.searchTerm$.next(value);
  }

  initials(name: string) {
    if (!name) return '';
    const parts = name.split(' ').filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
  }

  getRandomColor(gameId: string): string {
    const colors = [
      ['#F59E0B', '#F97316'],
      ['#06B6D4', '#0EA5A0'],
      ['#EF4444', '#F43F5E'],
      ['#7C3AED', '#A78BFA'],
      ['#111827', '#374151'],
      ['#10B981', '#059669'],
      ['#FB7185', '#F43F5E'],
      ['#3B82F6', '#2563EB'],
      ['#F97316', '#FB923C'],
      ['#8B5CF6', '#7C3AED'],
    ];

    let hash = 0;
    for (let i = 0; i < gameId.length; i++) {
      hash = gameId.charCodeAt(i) + ((hash << 5) - hash);
    }

    const index = Math.abs(hash) % colors.length;
    const [color1, color2] = colors[index];

    return `linear-gradient(135deg, ${color1}, ${color2})`;
  }
}
