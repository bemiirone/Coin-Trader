import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { TradesComponent } from './trades.component';
import { Store } from '@ngrx/store';
import { selectSelectedUser } from '../users/store/user.selectors';
import { User } from '../users/user.model';
import { Trade } from './trades.model';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { selectUserTrades } from './store/trades.selectors';
import { BsModalService } from 'ngx-bootstrap/modal';

fdescribe('TradesComponent', () => {
  let component: TradesComponent;
  let store: MockStore;
  let fixture: any;

  const mockUser: User = {
    _id: '1',
    name: 'User One',
    email: 'user1@example.com',
    password: 'password1',
    admin: false,
    portfolio_total: 1000,
    deposit: 500,
    cash: 500,
  };

  const mockTrades: Trade[] = [
    {
      _id: '1',
      user_id: '1',
      coin_id: 1,
      symbol: 'BTC',
      name: 'Bitcoin',
      amount: 0.5,
      price: 30000,
      date: new Date().toISOString(),
      volume: 15000,
      order: 'buy',
    },
    {
      _id: '2',
      user_id: '1',
      coin_id: 2,
      symbol: 'ETH',
      name: 'Ethereum',
      amount: 1,
      price: 2000,
      date: new Date().toISOString(),
      volume: 2000,
      order: 'buy',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradesComponent],
      providers: [
        provideMockStore({
          initialState: {}, // Mock the initial store state
        }),
        BsModalService,
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(TradesComponent);
    component = fixture.componentInstance;

    // Mock selectors
    store.overrideSelector(selectSelectedUser, mockUser);
    store.overrideSelector(selectUserTrades, mockTrades);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should select user and trades from the store on initialization', () => {
    // Subscribe to observables and verify values
    component.ngOnInit();

    component.user$.subscribe((user) => {
      expect(user).toEqual(mockUser);
    });

    component.trades$.subscribe((trades) => {
      expect(trades).toEqual(mockTrades);
    });
  });

});
