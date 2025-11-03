import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { GameSearchResponse } from '../models/game.model';

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
}
