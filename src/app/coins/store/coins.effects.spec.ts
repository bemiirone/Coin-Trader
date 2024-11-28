import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { CoinsEffects } from './coins.effects';
import { Observable, of, throwError } from 'rxjs';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { CoinsService } from '../../services/coin-market.service';
import { CoinsActions } from './coins.actions';
import { CoinResponse } from '../coins.model';
import { hot, cold } from 'jasmine-marbles';

describe('CoinsEffects', () => {
  let actions$: Observable<any>;
  let effects: CoinsEffects;
  let coinsService: jasmine.SpyObj<CoinsService>;
  let store: MockStore;
  const status = {
    timestamp: '2021-08-24T15:00:00.000Z',
    error_code: 0,
    error_message: 'Failed to load coins',
    elapsed: 10,
    credit_count: 1,
    notice: null,
    total_count: 1,
  };

  beforeEach(() => {
    const spy = jasmine.createSpyObj('CoinsService', ['getCoins']);

    TestBed.configureTestingModule({
      providers: [
        CoinsEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        { provide: CoinsService, useValue: spy },
      ],
    });

    effects = TestBed.inject(CoinsEffects);
    coinsService = TestBed.inject(CoinsService) as jasmine.SpyObj<CoinsService>;
    store = TestBed.inject(MockStore);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  it('should have a property called loadCoins$', () => {
    expect(effects.loadCoins$).toBeDefined();
  });

  it('should dispatch loadCoinsSuccess when loadCoins is successful', () => {
    const coinsResponse: CoinResponse = {
      status: status,
      data: [],
    };
    const action = CoinsActions.loadCoins();
    const outcome = CoinsActions.loadCoinsSuccess({
      coinsSuccess: coinsResponse,
    });

    actions$ = hot('-a', { a: action });
    const response = cold('-a|', { a: coinsResponse });
    coinsService.getCoins.and.returnValue(response);

    const expected = cold('--b', { b: outcome });
    expect(effects.loadCoins$).toBeObservable(expected);
  });

  it('should dispatch loadCoinsFailure when loadCoins fails', () => {
    const error = { 
      timestamp: '2021-08-24T15:00:00.000Z',
      error_code: 500,
      error_message: 'Failed to load coins',
      elapsed: 10,
      credit_count: 1,
      notice: null,
      total_count: 1,
    };
    const action = CoinsActions.loadCoins();
    const outcome = CoinsActions.loadCoinsFailure({ error: error.error_message });
  
    actions$ = hot('-a', { a: action });
    const response = cold('-#|', {}, error); // Simulating error response
    coinsService.getCoins.and.returnValue(response);
  
    const expected = cold('--b', { b: outcome });
    expect(effects.loadCoins$).toBeObservable(expected);
  });
});
