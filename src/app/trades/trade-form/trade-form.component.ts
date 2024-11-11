import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Trade } from '../trades.model';
import  { selectCoinTrades, selectCoinById } from '../../coins/store/coins.selectors';
import { Store } from '@ngrx/store';
import { TradedCryptoData } from '../../coins/coins.model';
import { map, Observable, of, switchMap, tap } from 'rxjs';
import { User } from '../../users/user.model';
import { selectSelectedUser } from '../../users/store/user.selectors';

@Component({
  standalone: true,
  selector: 'app-trade-form',
  templateUrl: './trade-form.component.html',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class TradeFormComponent implements OnInit {
  tradeForm!: FormGroup;
  coins$: Observable<TradedCryptoData[]> = of([]);
  coinData: TradedCryptoData = {} as TradedCryptoData;
  selectedCoin$!: Observable<TradedCryptoData | undefined>;
  user: User | null = {} as User;

  constructor(private fb: FormBuilder, private store: Store) {}

  ngOnInit(): void {
    this.tradeForm = this.fb.group({
      coin_id: ['', Validators.required],
      order: ['buy', Validators.required],
      currencyAmount: [0, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
    });

    this.coins$ = this.store.select(selectCoinTrades);
    this.selectedCoin$ = this.tradeForm.get('coin_id')!.valueChanges.pipe(
      switchMap((coinId) => this.store.select(selectCoinById(+coinId))),
      tap((coin) => {
      if (coin) {
        this.tradeForm.get('price')!.setValue(coin.price, { emitEvent: false });
        this.coinData = coin;
      }
      })
    );
    this.store.select(selectSelectedUser).subscribe((user) => {
      this.user = user;
    });
  }

  ngOnDestroy(): void {
    this.store.select(selectSelectedUser).subscribe().unsubscribe();
  }

  calculateVolume(): void {
    const currencyAmount = this.tradeForm.get('currencyAmount')?.value;

    this.selectedCoin$.pipe(
      map(coin => coin?.price ?? 0),
      map(price => currencyAmount / price)
    ).subscribe(volume => {
      this.tradeForm.get('volume')?.setValue(volume);
    });
  }

  onSubmit(): void {
    if (this.tradeForm.valid) {
      const currencyAmount = this.tradeForm.get('currencyAmount')?.value || 0;
      const coin = this.coinData;
      const tradeData: Trade = {
        ...this.tradeForm.getRawValue(),
        user_id: this.user?._id,
        symbol: coin.symbol,
        volume: currencyAmount / coin.price,
        date: new Date().toISOString() // timestamp
      };
      console.log('TradeData submitted:', tradeData);
      // Submit tradeData as needed
    }
  }

  clearForm(): void {
    this.tradeForm.reset();
  }
}
