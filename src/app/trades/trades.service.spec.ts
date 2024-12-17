import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TradesService } from './trades.service';
import { Trade } from './trades.model';
describe('TradesService', () => {
  let service: TradesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TradesService]
    });
    service = TestBed.inject(TradesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch trades', () => {
    const dummyTrades: Trade[] = [
      {
        _id: '1', symbol: 'BTC', price: 50000,
        coin_id: 1,
        name: '',
        amount: 100,
        date: '',
        volume: 200,
        order: 'buy'
      },
      {
        _id: '2', symbol: 'ETH', price: 4000,
        coin_id: 2,
        name: '',
        amount: 50,
        date: '',
        volume: 100,
        order: 'buy'
      }
    ];

    service.getTrades().subscribe(trades => {
      expect(trades.length).toBe(2);
      expect(trades).toEqual(dummyTrades);
    });

    const req = httpMock.expectOne(service['apiUrl']);
    expect(req.request.method).toBe('GET');
    req.flush(dummyTrades);
  });

  it('should add a trade', () => {
    const newTrade: Trade = {
      _id: '3', symbol: 'LTC', price: 200,
      coin_id: 0,
      name: '',
      amount: 0,
      date: '',
      volume: 0,
      order: 'buy'
    };

    service.addTrade(newTrade).subscribe(trade => {
      expect(trade).toEqual(newTrade);
    });

    const req = httpMock.expectOne(service['apiUrl']);
    expect(req.request.method).toBe('POST');
    req.flush(newTrade);
  });

  it('should update a trade', () => {
    const updatedTrade: Partial<Trade> = { price: 55000 };

    service.updateTrade('1', updatedTrade).subscribe(trade => {
      expect(trade.price).toBe(55000);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush({ ...updatedTrade, id: '1', symbol: 'BTC', quantity: 1 });
  });

  it('should delete a trade', () => {
    service.deleteTrade('1').subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});