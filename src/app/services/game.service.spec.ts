import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { GameService } from './game.service';
import { environment } from '../../environments/environment';
import { GameSearchResponse, GameDetails } from '../models/game.model';

describe('GameService', () => {
  let service: GameService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [provideZonelessChangeDetection(), GameService],
    });
    service = TestBed.inject(GameService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('searchGames', () => {
    it('should search games with default pagination', async () => {
      const mockResponse: GameSearchResponse = {
        content: [
          {
            id: '1',
            name: 'Test Game',
            yearPublished: 2020,
            isExpansion: false,
            prices: {
              new: 29.99,
              used: 19.99,
              auction: 15.00,
            },
          },
        ],
        totalElements: 1,
        totalPages: 1,
        number: 0,
        size: 10,
      };

      const searchPromise = service.searchGames('test');

      const req = httpMock.expectOne(
        `${environment.apiUrl}/games/search?query=test&page=0&size=10`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);

      const result = await searchPromise;
      expect(result).toEqual(mockResponse);
      expect(result.content.length).toBe(1);
      expect(result.content[0].name).toBe('Test Game');
    });

    it('should search games with custom pagination', async () => {
      const mockResponse: GameSearchResponse = {
        content: [],
        totalElements: 0,
        totalPages: 0,
        number: 2,
        size: 5,
      };

      const searchPromise = service.searchGames('test', 2, 5);

      const req = httpMock.expectOne(
        `${environment.apiUrl}/games/search?query=test&page=2&size=5`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);

      const result = await searchPromise;
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors', async () => {
      const searchPromise = service.searchGames('test');

      const req = httpMock.expectOne(
        `${environment.apiUrl}/games/search?query=test&page=0&size=10`
      );
      req.flush('Error', { status: 500, statusText: 'Server Error' });

      await expectAsync(searchPromise).toBeRejected();
    });
  });

  describe('getGameDetails', () => {
    it('should get game details by ID', async () => {
      const mockGameDetails: GameDetails = {
        id: 'test-game-1',
        name: 'Test Game',
        yearPublished: 2020,
        isExpansion: false,
        lowestPricesByCondition: {
          'new': {
            listingId: 'listing-1',
            condition: 'new',
            price: 99.99,
            city: 'São Paulo',
            state: 'SP',
            listingUrl: 'https://example.com/listing-1'
          },
          'used': {
            listingId: 'listing-2',
            condition: 'used',
            price: 79.99,
            city: 'Rio de Janeiro',
            state: 'RJ',
            listingUrl: 'https://example.com/listing-2'
          }
        }
      };

      const detailsPromise = service.getGameDetails('test-game-1');

      const req = httpMock.expectOne(`${environment.apiUrl}/games/test-game-1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockGameDetails);

      const result = await detailsPromise;
      expect(result).toEqual(mockGameDetails);
      expect(result.name).toBe('Test Game');
      expect(result.lowestPricesByCondition['new'].price).toBe(99.99);
    });

    it('should handle errors when getting game details', async () => {
      const detailsPromise = service.getGameDetails('nonexistent-game');

      const req = httpMock.expectOne(`${environment.apiUrl}/games/nonexistent-game`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });

      await expectAsync(detailsPromise).toBeRejected();
    });
  });
});
