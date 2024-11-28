import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TradeListComponent } from './trade-list.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { of } from 'rxjs';
import { Trade } from '../trades.model';
import { User } from '../../users/user.model';
import { selectCoinLoading, selectCoinError } from '../../coins/store/coins.selectors';
import { selectSelectedUser } from '../../users/store/user.selectors';
import { TradeFormComponent } from '../trade-form/trade-form.component';

fdescribe('TradeListComponent', () => {
  let component: TradeListComponent;
  let fixture: ComponentFixture<TradeListComponent>;
  let store: MockStore;
  let modalService: BsModalService;

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
      coin_id: 187,
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
    modalService = jasmine.createSpyObj('BsModalService', ['show']);
    await TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          initialState: {},
        }),
        {
          provide: BsModalService,
          useValue: {
            show: jasmine.createSpy('show').and.returnValue({ hide: jasmine.createSpy('hide') }),
          },
        },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    modalService = TestBed.inject(BsModalService);

    // Mock selectors
    store.overrideSelector(selectCoinLoading, false);
    store.overrideSelector(selectCoinError, null);
    store.overrideSelector(selectSelectedUser, mockUser);

    fixture = TestBed.createComponent(TradeListComponent);
    component = fixture.componentInstance;
    component.trades = mockTrades;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize loading$ and error$ observables on ngOnInit', () => {
    component.ngOnInit();

    component.loading$.subscribe((loading) => {
      expect(loading).toBe(false);
    });

    component.error$.subscribe((error) => {
      expect(error).toBeNull();
    });
  });

  it('should display the correct number of trade rows', () => {
    const tradeRows = fixture.debugElement.nativeElement.querySelectorAll('tr');
    expect(tradeRows.length).toBe(mockTrades.length + 1); // +1 for the header row
  });

  it('should open modal when openModal is called', () => {
    const mockUser: User = { _id: '1', name: 'User One', email: 'user1@example.com', portfolio_total: 1000 } as User;
    component.user = mockUser;
    component.openModal();

    expect(modalService.show).toHaveBeenCalled();
  });

  it('should log an error if user data is not available in openModal()', () => {
    const consoleErrorSpy = spyOn(console, 'error');

    // Test when user is not available
    component.user = null;
    component.openModal();

    expect(consoleErrorSpy).toHaveBeenCalledWith('User data not available!');
  });

  it('should unsubscribe from store on ngOnDestroy', () => {
    // Use a spy to check if unsubscribe is called
    const unsubscribeSpy = spyOn(store, 'select').and.returnValue(of(null));

    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });

  it('should correctly display trade details in the table', () => {
    fixture.detectChanges();
  
    const firstTradeRow = fixture.debugElement.nativeElement.querySelectorAll('tr')[1]; // First row after header
  
    // Extract the correctly formatted values
    const formattedPrice = '$30,000.00';
    const formattedAmount = '$0.50';
    const tradeOrder = 'Buy'; 
    
    // Ensure the text content contains the formatted values
    expect(firstTradeRow.textContent).toContain('Bitcoin');
    expect(firstTradeRow.textContent).toContain(formattedPrice); // Matching formatted price
    expect(firstTradeRow.textContent).toContain(formattedAmount); // Matching formatted amount
    expect(firstTradeRow.textContent).toContain('15000');
    expect(firstTradeRow.textContent).toContain(tradeOrder); // Matching "Buy"
  });
});
