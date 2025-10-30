import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameDetails } from './game-details';
import { provideZonelessChangeDetection } from '@angular/core';

describe('GameDetails', () => {
  let component: GameDetails;
  let fixture: ComponentFixture<GameDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameDetails],
      providers: [
        provideZonelessChangeDetection(),
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
