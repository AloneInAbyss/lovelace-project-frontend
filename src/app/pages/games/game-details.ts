import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { SplitterModule } from 'primeng/splitter';

interface Listing {
  id: string;
  city: string;
  condition: 'Novo' | 'Usado' | 'Leilão';
  price: number;
  endsAt?: string; // for auctions
}

@Component({
  selector: 'app-game-details',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    SplitterModule,
    ButtonModule,
    TableModule,
    TagModule,
    InputTextModule,
  ],
  templateUrl: './game-details.html',
  styleUrl: './game-details.css',
})
export class GameDetails {
  // Mocked game data
  game = {
    id: 'ticket-to-ride',
    name: 'Ticket to Ride',
    image: '', // can be data url or empty to show placeholder
    cheapest: {
      new: 999.99,
      used: 499.99,
      auction: 100.99,
    },
  };

  // Mocked listings
  listings: Listing[] = [
    { id: '1', city: 'SP - Mogi das Cruzes', condition: 'Novo', price: 999.99 },
    {
      id: '2',
      city: 'SP - Mogi das Cruzes',
      condition: 'Leilão',
      price: 999.99,
      endsAt: 'in 3 days',
    },
    { id: '3', city: 'SP - Mogi das Cruzes', condition: 'Usado', price: 499.99 },
    { id: '4', city: 'RJ - Niterói', condition: 'Usado', price: 450.0 },
    { id: '5', city: 'BH - Belo Horizonte', condition: 'Novo', price: 1050.0 },
    { id: '6', city: 'SP - São Paulo', condition: 'Leilão', price: 120.0, endsAt: 'in 1 day' },
    { id: '7', city: 'PR - Curitiba', condition: 'Usado', price: 420.0 },
    { id: '8', city: 'RS - Porto Alegre', condition: 'Novo', price: 980.0 },
    { id: '9', city: 'SP - Campinas', condition: 'Usado', price: 430.0 },
    { id: '10', city: 'PE - Recife', condition: 'Leilão', price: 150.0, endsAt: 'in 5 days' },
    { id: '11', city: 'DF - Brasília', condition: 'Novo', price: 995.0 },
    { id: '12', city: 'SP - Santos', condition: 'Usado', price: 440.0 },
    { id: '13', city: 'RJ - Rio de Janeiro', condition: 'Novo', price: 1020.0 },
    { id: '14', city: 'MG - Uberlândia', condition: 'Usado', price: 460.0 },
    { id: '15', city: 'CE - Fortaleza', condition: 'Leilão', price: 130.0, endsAt: 'in 2 days' },
    { id: '16', city: 'SP - Ribeirão Preto', condition: 'Novo', price: 1015.0 },
    { id: '17', city: 'RS - Caxias do Sul', condition: 'Usado', price: 470.0 },
    { id: '18', city: 'BA - Salvador', condition: 'Leilão', price: 140.0, endsAt: 'in 4 days' },
    { id: '19', city: 'PR - Londrina', condition: 'Novo', price: 1005.0 },
    { id: '20', city: 'SP - Sorocaba', condition: 'Usado', price: 480.0 },
    { id: '21', city: 'RJ - Petrópolis', condition: 'Leilão', price: 160.0, endsAt: 'in 6 days' },
    { id: '22', city: 'SC - Florianópolis', condition: 'Novo', price: 990.0 },
    { id: '23', city: 'GO - Goiânia', condition: 'Usado', price: 490.0 },
    {
      id: '24',
      city: 'SP - São José dos Campos',
      condition: 'Leilão',
      price: 170.0,
      endsAt: 'in 7 days',
    },
    { id: '25', city: 'RJ - Volta Redonda', condition: 'Novo', price: 985.0 },
    { id: '26', city: 'MG - Contagem', condition: 'Usado', price: 495.0 },
    { id: '27', city: 'PE - Olinda', condition: 'Leilão', price: 180.0, endsAt: 'in 8 days' },
    { id: '28', city: 'SP - Jundiaí', condition: 'Novo', price: 975.0 },
    { id: '29', city: 'RS - Pelotas', condition: 'Usado', price: 485.0 },
    {
      id: '30',
      city: 'BA - Feira de Santana',
      condition: 'Leilão',
      price: 190.0,
      endsAt: 'in 9 days',
    },
  ];

  // Filter state
  showFilterPanel = false;
  selectedConditions: string[] = []; // e.g. ['Novo','Usado']

  // Pagination state
  rows = 10;
  first = 0;

  constructor() {}

  get filteredListings(): Listing[] {
    if (!this.selectedConditions || this.selectedConditions.length === 0) return this.listings;
    return this.listings.filter((l) => this.selectedConditions.includes(l.condition));
  }

  get pagedListings(): Listing[] {
    const start = this.first;
    return this.filteredListings.slice(start, start + this.rows);
  }

  onPage(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  toggleCondition(cond: string) {
    const idx = this.selectedConditions.indexOf(cond);
    if (idx >= 0) this.selectedConditions.splice(idx, 1);
    else this.selectedConditions.push(cond);
    // reset pagination when filters change
    this.first = 0;
  }

  removeCondition(cond: string) {
    const idx = this.selectedConditions.indexOf(cond);
    if (idx >= 0) this.selectedConditions.splice(idx, 1);
  }

  addToWishlist() {
    // Mock behaviour
    console.log('Add to wishlist', this.game.id);
  }
}
