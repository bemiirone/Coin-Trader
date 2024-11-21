import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Trade } from '../trades.model';
import {
  selectCoinTrades,
  selectCoinById,
} from '../../coins/store/coins.selectors';
import { Store } from '@ngrx/store';
import { TradedCryptoData } from '../../coins/coins.model';
import { map, Observable, of, switchMap, tap } from 'rxjs';
import { User } from '../../users/user.model';
import { selectSelectedUser } from '../../users/store/user.selectors';
import { TradeActions } from '../store/trades.actions';
import { selectTradeLoading, selectTradeSuccess, selectUserAccumulatedTrades } from '../store/trades.selectors';
import { ModalComponent } from '../../shared/modal/modal.component';


@Component({
  standalone: true,
  selector: 'app-trade-form',
  templateUrl: './trade-form.component.html',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ModalComponent],
})
export class TradeFormComponent implements OnInit {
  @Input() user: User | null = {} as User;
  @Input() trades: Trade[] | null = [];
  tradeForm!: FormGroup;
  coins$: Observable<TradedCryptoData[]> = of([]);
  coinData: TradedCryptoData = {} as TradedCryptoData;
  selectedCoin$!: Observable<TradedCryptoData | undefined>;
  success$!: Observable<boolean>;
  isLoading$!: Observable<boolean>;
  accumulatedTrade$: Observable<Trade> = of({} as Trade);
  isBuy = false;
  isSell = false;

  constructor(
    private fb: FormBuilder,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.initFormSetUp();
    this.initCoinPrice();
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
  }
  

  initCoinPrice(): void {
    this.coins$ = this.store.select(selectCoinTrades);
    this.selectedCoin$ = this.tradeForm.get('coin_id')!.valueChanges.pipe(
      switchMap((coinId) => this.store.select(selectCoinById(+coinId))),
      tap((coin) => {
        if (coin) {
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

    this.tradeForm.get('order')!.valueChanges.subscribe((order) => {
      if (order) {
        this.tradeForm.get('coin_id')!.enable();
        this.isBuy = order === 'buy';
        this.isSell = order === 'sell';
      } else {
        this.tradeForm.get('coin_id')!.disable();
      }
    });
  }

  calculateVolume(): void {
    const amount = this.tradeForm.get('amount')?.value;
    const price = this.coinData.price ?? 0;
    const volume = amount / price;
    this.tradeForm.get('volume')?.setValue(volume);
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

  setAccumulatedTrade(): void {
    const coinId = this.tradeForm.get('coin_id')?.value;
    this.accumulatedTrade$ = this.store.select(selectUserAccumulatedTrades(+coinId));
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
      this.accumulatedTrade$.subscribe((trade) => {
        console.log('accumulatedTrade', trade);
      });
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
