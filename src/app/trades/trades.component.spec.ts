import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { TradesComponent } from './trades.component';
import { selectUserTrades } from './store/trades.selectors';
import { selectSelectedUser } from '../users/store/user.selectors';
import { BsModalService } from 'ngx-bootstrap/modal';
import { selectAuthUser } from '../users/store/auth/auth.selectors';

describe('TradesComponent', () => {
  let component: TradesComponent;
  let fixture: ComponentFixture<TradesComponent>;
  let store: MockStore;

  const initialMockState = {
    trades: {
      entities: {
        1: { _id: '1', user_id: 'user1', coin_id: 101, symbol: 'BTC', name: 'Bitcoin', amount: 100000, price: 50000, date: '2024-11-28T12:00:00Z', volume: 2, order: 'buy' },
        2: { _id: '2', user_id: 'user1', coin_id: 101, symbol: 'BTC', name: 'Bitcoin', amount: 60000, price: 60000, date: '2024-11-28T13:00:00Z', volume: 1, order: 'sell' },
      },
      ids: ['1', '2'],
      loading: false,
      success: false,
      error: null,
    },
    users: {
      entities: {
        user1: { _id: 'user1', name: 'Test User', email: '', portfolio_total: 1000, deposit: 500, cash: 500, admin: false },
      },
      ids: ['user1'],
      selectedUserId: 'user1',
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradesComponent],
      providers: [
        provideMockStore({ initialState: initialMockState }),
        BsModalService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TradesComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select user on init', () => {
    const spy = spyOn(store, 'select').and.callThrough();
  
    component.ngOnInit();
    expect(spy).toHaveBeenCalledWith(selectAuthUser);
    expect(spy).toHaveBeenCalledWith(selectUserTrades);
    expect(spy.calls.count()).toBe(2);
  });

  it('should select user trades on init', () => {
    const spy = spyOn(store, 'select').and.callThrough();
    component.ngOnInit();
    expect(spy).toHaveBeenCalledWith(selectUserTrades);
  });
});
