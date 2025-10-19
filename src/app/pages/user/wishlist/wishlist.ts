import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';

interface WishItem {
  id: string;
  title: string;
  image?: string;
  totalAvailable: number;
  cheapest: {
    new?: number | null;
    used?: number | null;
    auction?: number | null;
  };
}

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, AvatarModule],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.css',
})
export class Wishlist {
  items: WishItem[] = [
    {
      id: 'azul',
      title: 'Azul',
      image: '',
      totalAvailable: 12,
      cheapest: { new: 39.99, used: 29.5, auction: 15 },
    },
    {
      id: 'ticket-to-ride',
      title: 'Ticket to Ride',
      image: '',
      totalAvailable: 8,
      cheapest: { new: 44.99, used: 34.0, auction: 22 },
    },
    {
      id: 'gloomhaven',
      title: 'Gloomhaven',
      image: '',
      totalAvailable: 3,
      cheapest: { new: 119.99, used: 89.0, auction: 65 },
    },
  ];

  constructor(private router: Router) {}

  goToListings(item: WishItem) {
    this.router.navigate(['/game', item.id]);
  }

  remove(item: WishItem) {
    this.items = this.items.filter((i) => i.id !== item.id);
  }
}
