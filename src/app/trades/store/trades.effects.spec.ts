import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Observable, of, throwError } from 'rxjs';
import { TradesEffects } from './trades.effects';
import { TradesService } from '../trades.service';
import { UserService } from '../../users/user.service';
import { TradeActions } from './trades.actions';
import { UserActions } from '../../users/store/user.actions';
import { selectUserBuyTradesValue, selectUserCash } from './trades.selectors';
import { Trade } from '../trades.model';
import { selectSelectedUser } from '../../users/store/user.selectors';
import { User } from '../../users/user.model';
import { UserEffects } from '../../users/store/user.effects';

describe('TradesEffects', () => {
  let actions$: Observable<any>;
  let tradesEffects: TradesEffects;
  let userEffects: UserEffects;
  let tradesService: jasmine.SpyObj<TradesService>;
  let userService: jasmine.SpyObj<UserService>;
  let store: MockStore;


  beforeEach(() => {
    tradesService = jasmine.createSpyObj('TradesService', ['getTrades', 'addTrade']);
    userService = jasmine.createSpyObj('UserService', ['updateUserPortfolioAndCash']);

    TestBed.configureTestingModule({
      providers: [
        TradesEffects,
        provideMockActions(() => actions$),
        UserEffects,
        provideMockStore({
          selectors: [
            { selector: selectSelectedUser, value: { _id: '123', name: 'Test User' } },
            { selector: selectUserBuyTradesValue, value: 50000 },
            { selector: selectUserCash, value: 10000 },
          ],
        }),
        { provide: TradesService, useValue: tradesService },
        { provide: UserService, useValue: userService },
      ],
    });

    tradesEffects = TestBed.inject(TradesEffects);
    userEffects = TestBed.inject(UserEffects);
    store = TestBed.inject(MockStore);
  });

  it('should dispatch loadTradesSuccess on successful trades load', (done) => {
    const mockTrades: Trade[] = [{ _id: '1', user_id: '123', name: 'Bitcoin', price: 30000 } as Trade];
    tradesService.getTrades.and.returnValue(of(mockTrades));
    actions$ = of(TradeActions.loadTrades());

    tradesEffects.loadTrades$.subscribe((action) => {
      expect(action).toEqual(TradeActions.loadTradesSuccess({ trades: mockTrades }));
      expect(tradesService.getTrades).toHaveBeenCalled();
      done();
    });
  });

  it('should dispatch addTradeFailure on trade addition error', (done) => {
    const trade = {
      _id: '1',
      user_id: '123',
      coin_id: 1,
      symbol: 'BTC',
      name: 'Bitcoin',
      amount: 3000,
      price: 50000,
      date: new Date().toISOString(),
      volume: 0.06,
      order: 'buy' as 'buy',
    };
  
    const action = TradeActions.addTrade({ trade });
    const errorMessage = 'Failed to add trade';
    const failureAction = TradeActions.addTradeFailure({ error: errorMessage });
  
    tradesService.addTrade.and.returnValue(
      throwError(() => new Error(errorMessage))
    );
  
    actions$ = of(action);
  
    tradesEffects.addTrade$.subscribe((result) => {
      expect(result).toEqual(failureAction);
      expect(tradesService.addTrade).toHaveBeenCalledWith(trade);
      done();
    });
  });
  

  it('should dispatch addTradeSuccess on successful trade addition', (done) => {
    const newTrade: Trade = { _id: '2', user_id: '123', name: 'Ethereum', price: 2000 } as Trade;
    tradesService.addTrade.and.returnValue(of(newTrade));
    actions$ = of(TradeActions.addTrade({ trade: newTrade }));

    tradesEffects.addTrade$.subscribe((action) => {
      expect(action).toEqual(TradeActions.addTradeSuccess({ trade: newTrade }));
      expect(tradesService.addTrade).toHaveBeenCalledWith(newTrade);
      done();
    });
  });

  it('should dispatch addTradeFailure on trade addition error', (done) => {
    const newTrade: Trade = { _id: '3', user_id: '123', name: 'Litecoin', price: 100 } as Trade;
    const error = 'Failed to add trade';
    tradesService.addTrade.and.returnValue(throwError(() => new Error(error)));
    actions$ = of(TradeActions.addTrade({ trade: newTrade }));

    tradesEffects.addTrade$.subscribe((action) => {
      expect(action).toEqual(TradeActions.addTradeFailure({ error }));
      expect(tradesService.addTrade).toHaveBeenCalledWith(newTrade);
      done();
    });
  });

  it('should dispatch updateUserPortfolioSuccess on successful portfolio update', (done) => {
    const userId = '123';
    const portfolioTotal = 80000;
    const cash = 7000;
    const updatedUser: User = {
      _id: userId,
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword',
      admin: false,
      portfolio_total: portfolioTotal,
      cash,
      deposit: 50000,
    };
  
    const action = UserActions.updateUserPortfolio({ userId, portfolioTotal, cash });
    const successAction = UserActions.updateUserPortfolioSuccess({ user: updatedUser });
  
    actions$ = of(action); // Emit the action
    userService.updateUserPortfolioAndCash.and.returnValue(of(updatedUser)); // Mock successful API call
  
    userEffects.updatePortfolioTotal$.subscribe((result) => {
      expect(result).toEqual(successAction);
      expect(userService.updateUserPortfolioAndCash).toHaveBeenCalledWith(userId, portfolioTotal, cash);
      done();
    });
  });
  

  it('should dispatch updateUserPortfolioFailure on portfolio update error', (done) => {
    const userId = '123';
    const portfolioTotal = 80000;
    const cash = 7000;
    const trade: Trade = {
      _id: '1',
      user_id: userId,
      coin_id: 1,
      symbol: 'BTC',
      name: 'Bitcoin',
      amount: 3000,
      price: 50000,
      date: 'new Date()',
      volume: 0.06,
      order: 'buy',
    };
  
    const action = TradeActions.addTradeSuccess({ trade });
    const failureAction = UserActions.updateUserPortfolioFailure({
      error: 'Portfolio update failed',
    });
  
    // Mock store selector responses
    store.overrideSelector(selectSelectedUser, { 
      _id: userId, 
      name: 'Test User', 
      email: 'test@example.com', 
      password: 'hashedpassword', 
      admin: false, 
      portfolio_total: 80000, 
      cash, 
      deposit: 50000
    });
    store.overrideSelector(selectUserBuyTradesValue, portfolioTotal);
    store.overrideSelector(selectUserCash, cash);
  
    // Mock service failure
    userService.updateUserPortfolioAndCash.and.returnValue(
      throwError(() => new Error('Portfolio update failed'))
    );
  
    // Simulate the action stream
    actions$ = of(action);
  
    tradesEffects.addTradesSuccess$.subscribe((result) => {
      expect(result).toEqual(failureAction); // Validate emitted failure action
      expect(userService.updateUserPortfolioAndCash).toHaveBeenCalledWith(
        userId,
        portfolioTotal + trade.volume * trade.price, // Validate portfolio total calculation
        cash - trade.amount // Validate cash calculation
      );
      done();
    });
  });
  
});
