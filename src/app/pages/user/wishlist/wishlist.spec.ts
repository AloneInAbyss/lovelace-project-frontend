import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Wishlist } from './wishlist';
import { provideZonelessChangeDetection } from '@angular/core';

describe('Wishlist', () => {
  let component: Wishlist;
  let fixture: ComponentFixture<Wishlist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Wishlist],
      providers: [
        provideZonelessChangeDetection(),
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(Wishlist);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
