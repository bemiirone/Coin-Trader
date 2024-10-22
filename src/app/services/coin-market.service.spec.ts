import { TestBed } from '@angular/core/testing';

import { CoinMarketService } from './coin-market.service';

describe('CoinMarketService', () => {
  let service: CoinMarketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoinMarketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
