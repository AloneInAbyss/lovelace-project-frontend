import { Component, OnDestroy, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  map,
  delay,
  finalize,
  takeUntil,
} from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';

interface PriceSet {
  new?: number | null;
  used?: number | null;
  auction?: number | null;
}

interface BoardGame {
  id: string;
  name: string;
  color: string; // used for placeholder image background
  prices: PriceSet;
}

const mockedGameData: BoardGame[] = [
  {
    id: 'azul',
    name: 'Azul',
    color: 'linear-gradient(135deg,#F59E0B,#F97316)',
    prices: { new: 39.99, used: 29.5, auction: 15 },
  },
  {
    id: 'ticket-to-ride',
    name: 'Ticket to Ride',
    color: 'linear-gradient(135deg,#06B6D4,#0EA5A0)',
    prices: { new: 44.99, used: 34.0, auction: 22 },
  },
  {
    id: 'catan',
    name: 'Catan',
    color: 'linear-gradient(135deg,#EF4444,#F43F5E)',
    prices: { new: 49.99, used: 37.5, auction: null },
  },
  {
    id: 'wingspan',
    name: 'Wingspan',
    color: 'linear-gradient(135deg,#7C3AED,#A78BFA)',
    prices: { used: 45.0, auction: 30 },
  },
  {
    id: 'gloomhaven',
    name: 'Gloomhaven',
    color: 'linear-gradient(135deg,#111827,#374151)',
    prices: { new: 119.99, used: 89.0, auction: 65 },
  },
  {
    id: 'pandemic',
    name: 'Pandemic',
    color: 'linear-gradient(135deg,#10B981,#059669)',
    prices: { new: null, used: null, auction: null },
  },
  {
    id: 'carcassonne',
    name: 'Carcassonne',
    color: 'linear-gradient(135deg,#FB7185,#F43F5E)',
    prices: { auction: 9 },
  },
];

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    InputGroupAddonModule,
    InputGroupModule,
    ButtonModule,
    MenuModule,
  ],
  templateUrl: './home.page.html',
  styleUrl: './home.page.css',
})
export class HomePage implements OnInit, OnDestroy {
  searchControl = new FormControl<string | null>('');
  results: BoardGame[] = [];
  loading = false;
  showDropdown = false;
  private destroy$ = new Subject<void>();
  // explicit subject to drive the search pipeline (avoids timing/order issues with FormControl and input events)
  private searchTerm$ = new Subject<string>();
  // keep the last query string the pipeline processed
  private currentQuery = '';

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private authService: AuthService
  ) {
    this.setupSearch();
  }

  // schedule detectChanges in a microtask to avoid ExpressionChangedAfterItHasBeenCheckedError
  private scheduleDetectChanges() {
    Promise.resolve().then(() => this.cdr.detectChanges());
  }

  async ngOnInit(): Promise<void> {
    if (this.route.snapshot.data['verifyEmail']) {
      const token = this.route.snapshot.queryParams['token'];

      if (!token) {
        this.messageService.add({
          severity: 'error',
          summary: $localize`Erro`,
          detail: $localize`Token de verificação não fornecido.`,
        });

        return;
      }

      try {
        const response = await this.authService.verifyEmail(token);

        this.messageService.add({
          severity: 'success',
          summary: $localize`Sucesso`,
          detail: response.message || $localize`Email verificado com sucesso! Você pode fazer login agora.`
        });

        this.router.navigate(['/login']);
      } catch (error: any) {
        this.messageService.add({
          severity: 'error',
          summary: $localize`Erro`,
          detail: error?.message || $localize`Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.`,
        });

        this.router.navigate(['/']);
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.searchTerm$.complete();
  }

  setupSearch() {
    // Use an explicit subject driven from the input event to avoid timing/order problems
    this.searchTerm$
      .pipe(
        map((s: string | null) => (s ?? '').trim()),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((q: string) => {
          // track the query this pipeline iteration will handle
          this.currentQuery = q;
          if (!q) {
            // empty query: reset UI and return empty result
            this.results = [];
            this.currentQuery = '';
            this.showDropdown = false;
            this.loading = false;
            // ensure view updates immediately (scheduled to avoid ExpressionChangedAfterItHasBeenCheckedError)
            this.scheduleDetectChanges();
            return of([] as BoardGame[]);
          }

          // non-empty query: show dropdown and loading
          this.loading = true;
          // ensure the dropdown/loading state shows immediately (scheduled to avoid ExpressionChangedAfterItHasBeenCheckedError)
          this.scheduleDetectChanges();

          // ensure loading is cleared when inner observable finishes/errors/is canceled
          return this.mockSearch(q).pipe(finalize(() => (this.loading = false)));
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

  private mockSearch(q: string): Observable<BoardGame[]> {
    const normalized = q.toLowerCase();
    return of(
      mockedGameData.filter((g) => g.name.toLowerCase().includes(normalized)).slice(0, 5)
    ).pipe(delay(1000));
  }

  navigateToGame(g: BoardGame) {
    this.showDropdown = false;
    this.router.navigate(['/game', g.id]);
  }

  clear() {
    // update the visible input but don't rely on valueChanges for search (we push to searchTerm$ below)
    this.searchControl.setValue('');
    this.results = [];
    this.showDropdown = false;
    this.loading = false;
    // notify pipeline about the cleared value
    this.searchTerm$.next('');
    this.scheduleDetectChanges();
  }

  // Ensure immediate emission when user types (handles cases where some browsers/inputs only emit on blur)
  onInput(value: string) {
    // push the current input value into the search pipeline (avoids setValue ordering issues)
    this.searchTerm$.next(value);
  }

  initials(name: string) {
    if (!name) return '';
    const parts = name.split(' ').filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
  }
}
