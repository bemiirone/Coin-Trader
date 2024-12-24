import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppComponent } from './app.component';
import { CoinsActions } from './coins/store/coins.actions';
import { UserActions } from './users/store/user.actions';
import { TradeActions } from './trades/store/trades.actions';
import { selectAuthUser } from './users/store/auth/auth.selectors';
import { User } from './users/user.model';
import { Store } from '@ngrx/store';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let store: MockStore;
  let fixture: any;
  let component: AppComponent;

  const initialState = {
    auth: {
      user: {
        _id: '123',
        name: 'Test User',
        email: 'test@test.com',
      } as User,
      token: 'mock-token',
      error: null,
    },
  };

  const mockUser: User = {
    _id: '123',
    name: 'Test User',
    email: 'test@test.com',
    password: '',
    admin: false,
    portfolio_total: 0,
    deposit: 0,
    cash: 0,
  };

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: (key: string) => '123', 
      },
    },
    queryParams: of({}),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        RouterOutlet,
        HeaderComponent,
        SidebarComponent,
        CommonModule,
      ],
      providers: [
        provideMockStore({ initialState }),
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch load actions on ngOnInit', () => {
    const dispatchSpy = spyOn(store, 'dispatch');

    component.ngOnInit();

    expect(dispatchSpy).toHaveBeenCalledWith(CoinsActions.loadCoins());
    expect(dispatchSpy).toHaveBeenCalledWith(UserActions.loadUsers());
    expect(dispatchSpy).toHaveBeenCalledWith(TradeActions.loadTrades());
  });
});
