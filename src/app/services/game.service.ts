import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { GameSearchResponse, GameDetails } from '../models/game.model';

@Injectable({ providedIn: 'root' })
export class GameService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Search for games using the backend API
   * @param query - Search query string
   * @param page - Page number (0-indexed)
   * @param size - Number of results per page
   * @returns Promise with paginated game search results
   */
  searchGames(query: string, page = 0, size = 10): Promise<GameSearchResponse> {
    let params = new HttpParams()
      .set('query', query)
      .set('page', page.toString())
      .set('size', size.toString());

    return firstValueFrom(
      this.http.get<GameSearchResponse>(`${this.apiUrl}/games/search`, { params })
    );
  }

  /**
   * Get detailed information about a specific game
   * @param gameId - The unique identifier of the game
   * @returns Promise with game details including lowest prices by condition
   */
  getGameDetails(gameId: string): Promise<GameDetails> {
    return firstValueFrom(
      this.http.get<GameDetails>(`${this.apiUrl}/games/${gameId}`)
    );
  }
}
