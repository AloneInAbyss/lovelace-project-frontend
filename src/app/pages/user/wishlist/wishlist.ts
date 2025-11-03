import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MessageService } from 'primeng/api';
import { WishlistService } from '../../../services/wishlist.service';
import { WishlistItem } from '../../../models/wishlist.model';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, AvatarModule],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.css',
})
export class Wishlist implements OnInit {
  items: WishlistItem[] = [];
  loading = true;
  error: string | null = null;

  // Pagination state
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;

  constructor(
    private router: Router,
    private wishlistService: WishlistService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadWishlist();
  }

  async loadWishlist(): Promise<void> {
    this.loading = true;
    this.error = null;

    try {
      const response = await this.wishlistService.getWishlist(this.currentPage, this.pageSize);
      this.items = response.content;
      this.totalElements = response.totalElements;
      this.totalPages = response.totalPages;
      this.loading = false;
      this.cdr.detectChanges();
    } catch (err: any) {
      console.error('Error loading wishlist:', err);
      this.error = err?.message || 'Failed to load wishlist';
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  getLowestPrice(item: WishlistItem): { type: string; value: number } | null {
    const prices = item.lowestPricesByCondition;
    if (!prices) return null;

    const allPrices = [
      { type: 'new', value: prices['new']?.price },
      { type: 'used', value: prices['used']?.price },
      { type: 'auction', value: prices['auction']?.price },
    ].filter(p => p.value !== undefined && p.value !== null) as { type: string; value: number }[];

    if (allPrices.length === 0) return null;

    return allPrices.reduce((min, current) => 
      current.value < min.value ? current : min
    );
  }

  getCheapestPrices(item: WishlistItem) {
    const prices = item.lowestPricesByCondition;
    return {
      new: prices?.['new']?.price || null,
      used: prices?.['used']?.price || null,
      auction: prices?.['auction']?.price || null,
    };
  }

  getTotalAvailable(item: WishlistItem): number {
    const prices = item.lowestPricesByCondition;
    if (!prices) return 0;
    return Object.keys(prices).length;
  }

  goToListings(item: WishlistItem) {
    this.router.navigate(['/game', item.gameId]);
  }

  async remove(item: WishlistItem): Promise<void> {
    try {
      await this.wishlistService.removeFromWishlist(item.gameId);
      this.messageService.add({
        severity: 'success',
        summary: $localize`Sucesso`,
        detail: $localize`Jogo removido da lista de desejos!`,
      });
      // Reload the wishlist
      await this.loadWishlist();
    } catch (error: any) {
      console.error('Error removing from wishlist:', error);
      this.messageService.add({
        severity: 'error',
        summary: $localize`Erro`,
        detail: error?.message || $localize`Não foi possível remover o jogo da lista de desejos.`,
      });
    }
  }

  initials(name: string): string {
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
