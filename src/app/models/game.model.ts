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
