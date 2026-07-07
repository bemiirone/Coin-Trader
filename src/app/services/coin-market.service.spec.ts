import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CoinsService } from './coin-market.service';
import { WebSocketService } from './websocket.service';
import { environment } from '../../environments/environment';
import { CoinResponse } from '../coins/coins.model';

describe('CoinsService', () => {
  let service: CoinsService;
  let httpMock: HttpTestingController;
  let websocketServiceSpy: jasmine.SpyObj<WebSocketService>;

  const mockCoinResponse: CoinResponse = {
    status: {
      timestamp: '2024-01-01T00:00:00.000Z',
      error_code: 0,
      error_message: null,
      elapsed: 10,
      credit_count: 1,
      notice: null,
      total_count: 1,
    },
    data: [
      {
        id: 1,
        name: 'Bitcoin',
        symbol: 'BTC',
        slug: 'bitcoin',
        num_market_pairs: 10000,
        date_added: '2013-04-28T00:00:00.000Z',
        tags: ['mineable'],
        max_supply: 21000000,
        circulating_supply: 19000000,
        total_supply: 19000000,
        infinite_supply: false,
        platform: null,
        cmc_rank: 1,
        self_reported_circulating_supply: null,
        self_reported_market_cap: null,
        tvl_ratio: null,
        last_updated: '2024-01-01T00:00:00.000Z',
        quote: {
          USD: {
            price: 50000,
            volume_24h: 25000000000,
            percent_change_1h: 0.5,
            percent_change_24h: 2.3,
            percent_change_7d: 5.1,
            market_cap: 950000000000,
          }
        }
      }
    ]
  };

  beforeEach(() => {
    websocketServiceSpy = jasmine.createSpyObj('WebSocketService', [
      'getPriceUpdates$',
      'getTradeUpdates$',
      'getPortfolioUpdates$',
      'getConnectionStatus$',
      'connect',
      'disconnect'
    ]);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: WebSocketService, useValue: websocketServiceSpy }
      ]
    });

    service = TestBed.inject(CoinsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch coins from backend endpoint', () => {
    service.getCoins().subscribe(coins => {
      expect(coins.data.length).toBe(1);
      expect(coins.data[0].name).toBe('Bitcoin');
    });

    const req = httpMock.expectOne(`${environment.backendUrl}/api/coins?limit=500`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCoinResponse);
  });

  it('should not include CMC API key in request headers', () => {
    service.getCoins().subscribe();

    const req = httpMock.expectOne(`${environment.backendUrl}/api/coins?limit=500`);
    expect(req.request.headers.has('X-CMC_PRO_API_KEY')).toBeFalse();
    req.flush(mockCoinResponse);
  });
});
