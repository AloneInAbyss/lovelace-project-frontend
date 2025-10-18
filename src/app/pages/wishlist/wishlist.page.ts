import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule],
  template: `<main class="p-4"> <h1 class="text-2xl font-semibold">Wishlist</h1> <p>Your wishlist is empty.</p> </main>`,
})
export class WishlistPage {}
