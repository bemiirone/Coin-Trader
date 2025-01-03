import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Trade } from '../trades.model';
import {
  selectCoinTrades,
  selectCoinById,
} from '../../coins/store/coins.selectors';
import { Store } from '@ngrx/store';
import { TradedCryptoData } from '../../coins/coins.model';
import { Observable, of, switchMap, take, tap } from 'rxjs';
import { User } from '../../users/user.model';
import { TradeActions } from '../store/trades.actions';
import { selectTradeLoading, selectTradeSuccess, selectUserAccumulatedTrades, selectUserBuyTrades } from '../store/trades.selectors';
import { ModalComponent } from '../../shared/modal/modal.component';


@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-trade-form',
  templateUrl: './trade-form.component.html',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ModalComponent],
})
export class TradeFormComponent implements OnInit {
  @Input() user: User | null = {} as User;
  trades$!: Observable<Trade[]>;
  tradeForm!: FormGroup;
  coins$: Observable<TradedCryptoData[]> = of([]);
  coinData: TradedCryptoData = {} as TradedCryptoData;
  selectedCoin$!: Observable<TradedCryptoData | undefined>;
  success$!: Observable<boolean>;
  isLoading$!: Observable<boolean>;
  accumulatedTrade: Trade = {} as Trade;
  isBuy = false;
  isSell = false;

  constructor(
    private fb: FormBuilder,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.initFormSetUp();
    this.initCoinPrice();
    this.registerOrderChange();
    this.trades$ = this.store.select(selectUserBuyTrades);
    this.success$ = this.store.select(selectTradeSuccess);
    this.isLoading$ = this.store.select(selectTradeLoading);
  }

  initFormSetUp(): void { 
    this.tradeForm = this.fb.group({
      coin_id: [{ value: '', disabled: true }, Validators.required],
      order: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(1), this.cashValidator()]], 
      price: [0, [Validators.required, Validators.min(0.01)]],
    });
    this.registerOrderChange(); 
  }
  

  initCoinPrice(): void {
    this.coins$ = this.store.select(selectCoinTrades);
    this.selectedCoin$ = this.tradeForm.get('coin_id')!.valueChanges.pipe(
      switchMap((coinId) => this.store.select(selectCoinById(+coinId))),
      tap((coin) => {
        if (coin) {
          this.accumulatedTrade = {} as Trade;
          this.store.dispatch(TradeActions.resetTradeSuccess());
          this.tradeForm
            .get('price')!
            .setValue(coin.price, { emitEvent: false });
          this.coinData = coin;
          if (this.tradeForm.get('order')?.value === 'sell') {
            this.setAccumulatedTrade();
          }
        }
      })
    );
  }

  registerOrderChange(): void {
    this.tradeForm.get('order')?.valueChanges.subscribe((order) => {
      const coinIdControl = this.tradeForm.get('coin_id');
      const amountControl = this.tradeForm.get('amount');
  
      if (order === 'sell') {
        this.isSell = true;
        this.isBuy = false;
        coinIdControl?.setValue(null); 
        coinIdControl?.enable(); 
        amountControl?.setValidators([
          Validators.required,
          Validators.min(1),
          this.cashValidator(),
          this.accumulatedTradeValidator(), 
        ]);
      } else if (order === 'buy'){
        this.isBuy = true;
        this.isSell = false
        coinIdControl?.setValue(null); 
        coinIdControl?.enable(); 
        amountControl?.setValidators([
          Validators.required,
          Validators.min(1),
          this.cashValidator(), 
        ]);
      }
  
      amountControl?.updateValueAndValidity(); 
      coinIdControl?.updateValueAndValidity(); 
    });
  }
  

  cashValidator() {
    return (control: any) => {
      const value = control.value;
      if ((value > (this.user?.cash ?? 0) && this.tradeForm.get('order')?.value === 'buy')) {
        return { insufficientFunds: true };
      }
      return null;
    };
  }


  accumulatedTradeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      const order = this.tradeForm?.get('order')?.value; 
      if (order === 'sell') {
        const accumulatedTradeValue = this.accumulatedTrade?.value || 0;
        if (value > accumulatedTradeValue) {
          return { insufficientCoins: true };
        }
      }
      return null;
    };
  }

  setAccumulatedTrade(): void {
    const coinId = this.tradeForm.get('coin_id')?.value;
    this.store.select(selectUserAccumulatedTrades(+coinId)).pipe(take(1)).subscribe((trade) => {
      this.accumulatedTrade = trade;
    });
  }

  onSubmit(): void {
    if (this.tradeForm.valid) {
      const amount = this.tradeForm.get('amount')?.value || 0;
      const coin = this.coinData;
      const tradeData: Trade = {
        ...this.tradeForm.getRawValue(),
        user_id: this.user?._id,
        name: coin.name,
        symbol: coin.symbol,
        volume: amount / coin.price,
        date: new Date().toISOString(),
      };
      this.store.dispatch(TradeActions.addTrade({ trade: tradeData }));
      
      this.clearForm();
    }
  }

  ngOnDestroy(): void {
    this.tradeForm.get('order')?.valueChanges.subscribe().unsubscribe();
  }
  
  clearForm(): void {
    this.tradeForm.reset();
  }
}
