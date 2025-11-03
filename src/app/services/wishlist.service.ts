import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { WishlistResponse, AddToWishlistRequest } from '../models/wishlist.model';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Get user's wishlist with pagination
   * @param page - Page number (0-indexed)
   * @param size - Number of items per page
   * @returns Promise with paginated wishlist items
   */
  getWishlist(page = 0, size = 10): Promise<WishlistResponse> {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      return Promise.reject(new Error('User not authenticated'));
    }

    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return firstValueFrom(
      this.http.get<WishlistResponse>(`${this.apiUrl}/wishlist`, {
        params,
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })
    );
  }

  /**
   * Add a game to the user's wishlist
   * @param gameId - The unique identifier of the game
   * @returns Promise that resolves when the game is added
   */
  addToWishlist(gameId: string): Promise<void> {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      return Promise.reject(new Error('User not authenticated'));
    }

    const request: AddToWishlistRequest = { gameId };

    return firstValueFrom(
      this.http.post<void>(`${this.apiUrl}/wishlist`, request, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })
    );
  }

  /**
   * Remove a game from the user's wishlist
   * @param gameId - The unique identifier of the game to remove
   * @returns Promise that resolves when the game is removed
   */
  removeFromWishlist(gameId: string): Promise<void> {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      return Promise.reject(new Error('User not authenticated'));
    }

    return firstValueFrom(
      this.http.delete<void>(`${this.apiUrl}/wishlist/${gameId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })
    );
  }
}
