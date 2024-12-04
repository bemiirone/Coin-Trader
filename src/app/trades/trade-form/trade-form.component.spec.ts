import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TradeFormComponent } from './trade-form.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

describe('TradeFormComponent', () => {
  let component: TradeFormComponent;
  let fixture: ComponentFixture<TradeFormComponent>;

  let store: MockStore;
  const initialMockState = {
    trades: {
      entities: {
        1: {
          _id: '1',
          user_id: 'user1',
          coin_id: 101,
          symbol: 'BTC',
          name: 'Bitcoin',
          amount: 100000,
          price: 50000,
          date: '2024-11-28T12:00:00Z',
          volume: 2,
          order: 'buy',
        },
        2: {
          _id: '2',
          user_id: 'user1',
          coin_id: 101,
          symbol: 'BTC',
          name: 'Bitcoin',
          amount: 60000,
          price: 60000,
          date: '2024-11-28T13:00:00Z',
          volume: 1,
          order: 'sell',
        },
      },
      ids: ['1', '2'],
      loading: false,
      success: false,
      error: null,
    },
    users: {
      entities: {
        user1: {
          _id: 'user1',
          name: 'Test User',
          email: '',
          portfolio_total: 1000,
          deposit: 500,
          cash: 500,
          admin: false,
        },
      },
      ids: ['user1'],
      selectedUserId: 'user1',
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradeFormComponent],
      providers: [provideMockStore({ initialState: initialMockState })],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(TradeFormComponent);
    component = fixture.componentInstance;
    component.user = {
      _id: 'user1',
      name: 'Test User',
      email: '',
      password: '',
      portfolio_total: 1000,
      deposit: 500,
      cash: 100, // User has 100 cash for the test
      admin: false,
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form and observables on ngOnInit', () => {
    spyOn(component, 'initFormSetUp').and.callThrough();
    spyOn(component, 'initCoinPrice').and.callThrough();
    spyOn(component, 'registerOrderChange').and.callThrough();

    component.ngOnInit();

    expect(component.initFormSetUp).toHaveBeenCalled();
    expect(component.initCoinPrice).toHaveBeenCalled();
    expect(component.registerOrderChange).toHaveBeenCalled();
    expect(component.trades$).toBeDefined();
    expect(component.success$).toBeDefined();
    expect(component.isLoading$).toBeDefined();
  });

  it('should set up the form correctly', () => {
    component.initFormSetUp();

    expect(component.tradeForm).toBeDefined();
    expect(component.tradeForm.get('coin_id')).toBeTruthy();
    expect(component.tradeForm.get('order')).toBeTruthy();
    expect(component.tradeForm.get('amount')).toBeTruthy();
    expect(component.tradeForm.get('price')).toBeTruthy();
  });

  it('should handle order change correctly', () => {
    component.initFormSetUp();
    component.registerOrderChange();

    const orderControl = component.tradeForm.get('order');
    const coinIdControl = component.tradeForm.get('coin_id');
    const amountControl = component.tradeForm.get('amount');

    orderControl?.setValue('sell');
    expect(component.isSell).toBeTrue();
    expect(component.isBuy).toBeFalse();
    expect(coinIdControl?.enabled).toBeTrue();
    expect(amountControl?.validator).toBeTruthy();

    orderControl?.setValue('buy');
    expect(component.isBuy).toBeTrue();
    expect(component.isSell).toBeFalse();
    expect(coinIdControl?.enabled).toBeTrue();
    expect(amountControl?.validator).toBeTruthy();
  });

  it('should handle coin price initialization correctly', () => {
    component.initCoinPrice();

    expect(component.coins$).toBeDefined();
    expect(component.selectedCoin$).toBeDefined();
  });

  // test cash validator
  it('should test cashValidator method correctly', () => {
    component.initFormSetUp();
    component.tradeForm.get('order')?.setValue('buy');
    const cashValidator = component.cashValidator();

    const mockControl1 = { value: 150 };
    expect(cashValidator(mockControl1)).toEqual({ insufficientFunds: true });

    const mockControl2 = { value: 50 };
    expect(cashValidator(mockControl2)).toBeNull();

    const mockControl3 = { value: 100 };
    expect(cashValidator(mockControl3)).toBeNull();
  });

  it('should test form submission correctly', () => {
    component.initFormSetUp();
    component.tradeForm.get('coin_id')?.setValue(101);
    component.tradeForm.get('order')?.setValue('buy');
    component.tradeForm.get('amount')?.setValue(1);
    component.tradeForm.get('price')?.setValue(50000);

    spyOn(component, 'setAccumulatedTrade').and.callThrough();
    spyOn(component, 'onSubmit').and.callThrough();

    component.onSubmit();
    expect(component.onSubmit).toHaveBeenCalled();
  });

  // test form reset
  it('should test form reset correctly', () => {
    component.initFormSetUp();
    component.tradeForm.get('coin_id')?.setValue(101);
    component.tradeForm.get('order')?.setValue('buy');
    component.tradeForm.get('amount')?.setValue(1);
    component.tradeForm.get('price')?.setValue(50000);

    spyOn(component, 'clearForm' as any).and.callThrough();

    component.clearForm();
    expect(component.clearForm).toHaveBeenCalled();
  });
});
