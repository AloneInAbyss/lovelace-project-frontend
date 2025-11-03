import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { WishlistService } from './wishlist.service';
import { environment } from '../../environments/environment';
import { WishlistResponse } from '../models/wishlist.model';

describe('WishlistService', () => {
  let service: WishlistService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [provideZonelessChangeDetection(), WishlistService],
    });
    service = TestBed.inject(WishlistService);
    httpMock = TestBed.inject(HttpTestingController);

    // Mock localStorage
    localStorage.setItem('accessToken', 'test-token');
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getWishlist', () => {
    it('should get wishlist with default pagination', async () => {
      const mockResponse: WishlistResponse = {
        content: [
          {
            id: '1',
            gameId: 'game-1',
            gameName: 'Test Game',
            yearPublished: 2020,
            isExpansion: false,
            addedAt: '2025-11-03T23:41:16.858',
            lowestPricesByCondition: {},
          },
        ],
        totalElements: 1,
        totalPages: 1,
        number: 0,
        size: 10,
        first: true,
        last: true,
        empty: false,
      };

      const wishlistPromise = service.getWishlist();

      const req = httpMock.expectOne(
        `${environment.apiUrl}/wishlist?page=0&size=10`
      );
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
      req.flush(mockResponse);

      const result = await wishlistPromise;
      expect(result).toEqual(mockResponse);
    });

    it('should reject if user is not authenticated', async () => {
      localStorage.removeItem('accessToken');
      
      await expectAsync(service.getWishlist()).toBeRejectedWithError('User not authenticated');
    });
  });

  describe('addToWishlist', () => {
    it('should add a game to wishlist', async () => {
      const addPromise = service.addToWishlist('game-123');

      const req = httpMock.expectOne(`${environment.apiUrl}/wishlist`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ gameId: 'game-123' });
      expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
      req.flush(null);

      await expectAsync(addPromise).toBeResolved();
    });

    it('should reject if user is not authenticated', async () => {
      localStorage.removeItem('accessToken');
      
      await expectAsync(service.addToWishlist('game-123')).toBeRejectedWithError('User not authenticated');
    });
  });

  describe('removeFromWishlist', () => {
    it('should remove a game from wishlist', async () => {
      const removePromise = service.removeFromWishlist('game-123');

      const req = httpMock.expectOne(`${environment.apiUrl}/wishlist/game-123`);
      expect(req.request.method).toBe('DELETE');
      expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
      req.flush(null);

      await expectAsync(removePromise).toBeResolved();
    });

    it('should reject if user is not authenticated', async () => {
      localStorage.removeItem('accessToken');
      
      await expectAsync(service.removeFromWishlist('game-123')).toBeRejectedWithError('User not authenticated');
    });
  });
});
