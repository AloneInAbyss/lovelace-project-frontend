export interface BoardGame {
  id: string;
  name: string;
  yearPublished: number;
  isExpansion: boolean;
  prices?: PriceSet;
}

export interface PriceSet {
  new?: number | null;
  used?: number | null;
  auction?: number | null;
}

export interface GameSearchResponse {
  content: BoardGame[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface GameDetails {
  id: string;
  name: string;
  yearPublished: number;
  isExpansion: boolean;
  lowestPricesByCondition: Record<string, LowestPriceListing>; // key: condition (new, used, auction)
}

export interface LowestPriceListing {
  listingId: string;
  condition: string;
  price: number;
  city: string;
  state: string;
  listingUrl: string;
}
