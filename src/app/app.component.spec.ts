import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { AppComponent } from './app.component';
import { CoinsActions } from './coins/store/coins.actions';
import { UserActions } from './users/store/user.actions';
import { TradeActions } from './trades/store/trades.actions';
import { selectAllUsers, selectSelectedUser } from './users/store/user.selectors';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let store: MockStore;
  let component: AppComponent;
  let mockActivatedRoute: any;

  const mockUsers = [
    { _id: '1', name: 'User One', email: 'user1@example.com', password: 'password1', admin: false, portfolio_total: 1000, deposit: 500, cash: 500 },
    { _id: '2', name: 'User Two', email: 'user2@example.com', password: 'password2', admin: false, portfolio_total: 2000, deposit: 1000, cash: 1000 },
  ];
  const mockSelectedUser = { _id: '1', name: 'User One', email: 'user1@example.com', password: 'password1', admin: false, portfolio_total: 1000, deposit: 500, cash: 500 };

  const initialState = {};

  beforeEach(async () => {
    mockActivatedRoute = {
      params: of({}),
      queryParams: of({}),
    };

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideMockStore({}),
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);

    // Mock selectors
    store.overrideSelector(selectAllUsers, mockUsers);
    store.overrideSelector(selectSelectedUser, mockSelectedUser);

    const fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch load actions and set observables on ngOnInit', () => {
    const spyDispatch = spyOn(store, 'dispatch').and.callThrough();

    component.ngOnInit();

    expect(spyDispatch).toHaveBeenCalledWith(CoinsActions.loadCoins());
    expect(spyDispatch).toHaveBeenCalledWith(UserActions.loadUsers());
    expect(spyDispatch).toHaveBeenCalledWith(
      UserActions.setSelectedUserId({ id: '67239c55e0853b7bcf32d013' })
    );
    expect(spyDispatch).toHaveBeenCalledWith(TradeActions.loadTrades());

    component.users$.subscribe((users) => {
      expect(users).toEqual(mockUsers);
    });

    component.selectedUser$.subscribe((user) => {
      expect(user).toEqual(mockSelectedUser);
    });
  });
});
