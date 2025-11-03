import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { SplitterModule } from 'primeng/splitter';
import { MessageService } from 'primeng/api';
import { GameService } from '../../services/game.service';
import { AuthService } from '../../services/auth.service';
import { WishlistService } from '../../services/wishlist.service';
import { GameDetails as GameDetailsModel } from '../../models/game.model';

interface Listing {
  id: string;
  city: string;
  state: string;
  condition: string;
  price: number;
  listingUrl: string;
}

@Component({
  selector: 'app-game-details',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    SplitterModule,
    ButtonModule,
    TableModule,
    TagModule,
    InputTextModule,
  ],
  templateUrl: './game-details.html',
  styleUrl: './game-details.css',
})
export class GameDetails implements OnInit {
  gameDetails: GameDetailsModel | null = null;
  loading = true;
  error: string | null = null;
  isInWishlist = false;
  checkingWishlist = true;

  selectedConditions: string[] = []; // e.g. ['new','used','auction']

  // Pagination state
  rows = 10;
  first = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gameService: GameService,
    private authService: AuthService,
    private wishlistService: WishlistService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    const gameId = this.route.snapshot.paramMap.get('id');
    
    if (!gameId) {
      this.error = 'Game ID not provided';
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }

    try {
      this.gameDetails = await this.gameService.getGameDetails(gameId);
      this.loading = false;
      this.cdr.detectChanges();
      
      // Check if game is in wishlist (only if user is logged in)
      await this.checkIfInWishlist();
    } catch (err: any) {
      console.error('Error loading game details:', err);
      this.error = err?.message || 'Failed to load game details';
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  async checkIfInWishlist(): Promise<void> {
    // Check if user is logged in
    let isLoggedIn = false;
    this.authService.isLoggedIn$.subscribe(loggedIn => {
      isLoggedIn = loggedIn;
    }).unsubscribe();

    if (!isLoggedIn) {
      this.checkingWishlist = false;
      this.isInWishlist = false;
      this.cdr.detectChanges();
      return;
    }

    try {
      // Fetch the wishlist and check if current game is in it
      const wishlist = await this.wishlistService.getWishlist(0, 100); // Get up to 100 items
      this.isInWishlist = wishlist.content.some((item: { gameId: string; }) => item.gameId === this.game.id);
      this.checkingWishlist = false;
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error checking wishlist:', error);
      this.checkingWishlist = false;
      this.cdr.detectChanges();
    }
  }

  get game() {
    if (!this.gameDetails) {
      return {
        id: '',
        name: '',
        cheapest: { new: null, used: null, auction: null }
      };
    }

    const lowestPrices = this.gameDetails.lowestPricesByCondition || {};
    
    return {
      id: this.gameDetails.id,
      name: this.gameDetails.name,
      yearPublished: this.gameDetails.yearPublished,
      isExpansion: this.gameDetails.isExpansion,
      cheapest: {
        new: lowestPrices['new']?.price || null,
        used: lowestPrices['used']?.price || null,
        auction: lowestPrices['auction']?.price || null,
      }
    };
  }

  get listings(): Listing[] {
    if (!this.gameDetails?.lowestPricesByCondition) return [];
    
    const lowestPrices = this.gameDetails.lowestPricesByCondition;
    const listings: Listing[] = [];

    // Convert the lowestPricesByCondition map to an array of listings
    Object.entries(lowestPrices).forEach(([condition, listing]) => {
      if (listing) {
        listings.push({
          id: listing.listingId,
          city: listing.city,
          state: listing.state,
          condition: this.formatCondition(condition),
          price: listing.price,
          listingUrl: listing.listingUrl
        });
      }
    });

    return listings;
  }

  get filteredListings(): Listing[] {
    if (!this.selectedConditions || this.selectedConditions.length === 0) {
      return this.listings;
    }
    
    return this.listings.filter((l) => 
      this.selectedConditions.includes(this.normalizeCondition(l.condition))
    );
  }

  get pagedListings(): Listing[] {
    const start = this.first;
    return this.filteredListings.slice(start, start + this.rows);
  }

  onPage(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  toggleCondition(cond: string) {
    const idx = this.selectedConditions.indexOf(cond);
    if (idx >= 0) {
      this.selectedConditions.splice(idx, 1);
    } else {
      this.selectedConditions.push(cond);
    }
    // reset pagination when filters change
    this.first = 0;
  }

  removeCondition(cond: string) {
    const idx = this.selectedConditions.indexOf(cond);
    if (idx >= 0) {
      this.selectedConditions.splice(idx, 1);
    }
  }

  toggleWishlist() {
    // Check if user is logged in
    let isLoggedIn = false;
    this.authService.isLoggedIn$.subscribe(loggedIn => {
      isLoggedIn = loggedIn;
    }).unsubscribe();

    if (!isLoggedIn) {
      // Redirect to login page if not logged in
      this.router.navigate(['/login']);
      return;
    }

    if (this.isInWishlist) {
      this.removeFromWishlist();
    } else {
      this.addToWishlist();
    }
  }

  addToWishlist() {
    // Add to wishlist
    this.wishlistService.addToWishlist(this.game.id)
      .then(() => {
        this.isInWishlist = true;
        this.cdr.detectChanges();
        this.messageService.add({
          severity: 'success',
          summary: $localize`Sucesso`,
          detail: $localize`Jogo adicionado à lista de desejos!`,
        });
      })
      .catch((error) => {
        console.error('Error adding to wishlist:', error);
        this.messageService.add({
          severity: 'error',
          summary: $localize`Erro`,
          detail: error?.message || $localize`Não foi possível adicionar o jogo à lista de desejos.`,
        });
      });
  }

  removeFromWishlist() {
    // Remove from wishlist
    this.wishlistService.removeFromWishlist(this.game.id)
      .then(() => {
        this.isInWishlist = false;
        this.cdr.detectChanges();
        this.messageService.add({
          severity: 'success',
          summary: $localize`Sucesso`,
          detail: $localize`Jogo removido da lista de desejos!`,
        });
      })
      .catch((error) => {
        console.error('Error removing from wishlist:', error);
        this.messageService.add({
          severity: 'error',
          summary: $localize`Erro`,
          detail: error?.message || $localize`Não foi possível remover o jogo da lista de desejos.`,
        });
      });
  }

  /**
   * Format condition from API format (new, used, auction) to display format
   */
  private formatCondition(condition: string): string {
    const conditionMap: Record<string, string> = {
      'new': 'Novo',
      'used': 'Usado',
      'auction': 'Leilão'
    };
    return conditionMap[condition.toLowerCase()] || condition;
  }

  /**
   * Normalize condition from display format back to API format
   */
  private normalizeCondition(condition: string): string {
    const conditionMap: Record<string, string> = {
      'Novo': 'new',
      'Usado': 'used',
      'Leilão': 'auction'
    };
    return conditionMap[condition] || condition.toLowerCase();
  }
}
