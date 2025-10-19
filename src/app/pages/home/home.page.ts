import { Component, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, map } from 'rxjs/operators';
import { Observable, of, Subscription } from 'rxjs';
import { Router } from '@angular/router';

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

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.page.html',
  styleUrl: './home.page.css',
})
export class HomePage implements OnDestroy {
  searchControl = new FormControl<string | null>('');
  results: BoardGame[] = [];
  loading = false;
  showDropdown = false;

  private sub: Subscription;

  // small mock dataset
  private mockData: BoardGame[] = [
    { id: 'azul', name: 'Azul', color: 'linear-gradient(135deg,#F59E0B,#F97316)', prices: { new: 39.99, used: 29.5, auction: 15 } },
    { id: 'ticket-to-ride', name: 'Ticket to Ride', color: 'linear-gradient(135deg,#06B6D4,#0EA5A0)', prices: { new: 44.99, used: 34.0, auction: 22 } },
    { id: 'catan', name: 'Catan', color: 'linear-gradient(135deg,#EF4444,#F43F5E)', prices: { new: 49.99, used: 37.5, auction: null } },
    { id: 'wingspan', name: 'Wingspan', color: 'linear-gradient(135deg,#7C3AED,#A78BFA)', prices: { new: 59.99, used: 45.0, auction: 30 } },
    { id: 'gloomhaven', name: 'Gloomhaven', color: 'linear-gradient(135deg,#111827,#374151)', prices: { new: 119.99, used: 89.0, auction: 65 } },
    { id: 'pandemic', name: 'Pandemic', color: 'linear-gradient(135deg,#10B981,#059669)', prices: { new: 34.99, used: 24.5, auction: null } },
    { id: 'carcassonne', name: 'Carcassonne', color: 'linear-gradient(135deg,#FB7185,#F43F5E)', prices: { new: 29.99, used: 19.5, auction: 9 } },
  ];

  constructor(private router: Router, private host: ElementRef<HTMLElement>) {
    // wire up debounced search
    this.sub = this.searchControl.valueChanges
      .pipe(
        // normalize possible null to string early so downstream operators have correct types
        map((v) => (v ?? '').toString()),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term: string) => {
          const q = term.trim();
          if (!q) {
            this.results = [];
            this.showDropdown = false;
            return of([]);
          }
          this.loading = true;
          // simulate API call
          return of(this.mockSearch(q)).pipe(map((r) => r));
        })
      )
      .subscribe((res: BoardGame[]) => {
        this.loading = false;
        this.results = res;
        this.showDropdown = res.length > 0;
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private mockSearch(q: string): BoardGame[] {
    const normalized = q.toLowerCase();
    return this.mockData.filter((g) => g.name.toLowerCase().includes(normalized)).slice(0, 5);
  }

  navigateToGame(g: BoardGame) {
    // we only navigate to a route; page not implemented yet
    this.showDropdown = false;
    this.router.navigate(['/game', g.id]);
  }

  clear() {
    this.searchControl.setValue('');
    this.results = [];
    this.showDropdown = false;
  }

  initials(name: string) {
    if (!name) return '';
    const parts = name.split(' ').filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
  }
}
