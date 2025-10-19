import { Component, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, map, delay } from 'rxjs/operators';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';

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
export class HomePage implements OnDestroy {
  searchControl = new FormControl<string | null>('');
  results: BoardGame[] = [];
  loading = false;
  showDropdown = false;

  private searchText$ = new Subject<string>();

  constructor(private router: Router) {
    this.setupSearch();
  }

  ngOnDestroy(): void {
    this.searchText$?.unsubscribe();
  }

  search(term: string) {
    this.searchText$.next(term);
  }

  setupSearch() {
    this.searchText$
      .pipe(
        map((s) => (s ?? '').trim()),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((q) => {
          if (!q) {
            this.loading = false;
            this.results = [];
            this.showDropdown = false;
            return of([] as BoardGame[]);
          }

          this.loading = true;
          this.showDropdown = false;
          return this.mockSearch(q);
        })
      )
      .subscribe({
        next: (res) => {
          this.results = res;
          this.loading = false;
          this.showDropdown = true;
        },
        error: () => {
          this.results = [];
          this.loading = false;
          this.showDropdown = false;
        },
      });
  }

  private mockSearch(q: string): Observable<BoardGame[]> {
    const normalized = q.toLowerCase();
    return of(
      mockedGameData
      .filter((g) => g.name.toLowerCase().includes(normalized))
      .slice(0, 5)
    ).pipe(delay(1000));
  }

  navigateToGame(g: BoardGame) {
    this.showDropdown = false;
    this.router.navigate(['/game', g.id]);
  }

  clear() {
    this.searchControl.setValue('');
    this.results = [];
    this.showDropdown = false;
    this.loading = false;
  }

  initials(name: string) {
    if (!name) return '';
    const parts = name.split(' ').filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
  }
}
