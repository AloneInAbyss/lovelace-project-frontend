import { LowestPriceListing } from "./game.model";

export interface WishlistItem {
  id: string;
  gameId: string;
  gameName: string;
  yearPublished: number;
  isExpansion: boolean;
  addedAt: string;
  lowestPricesByCondition: Record<string, LowestPriceListing>;
}

export interface WishlistResponse {
  content: WishlistItem[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface AddToWishlistRequest {
  gameId: string;
}
