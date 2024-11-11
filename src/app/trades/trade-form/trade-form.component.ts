import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Trade } from '../trades.model';
import  { selectCoinTrades, selectCoinById } from '../../coins/store/coins.selectors';
import { Store } from '@ngrx/store';
import { TradedCryptoData } from '../../coins/coins.model';
import { map, Observable, of, switchMap, tap } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-trade-form',
  templateUrl: './trade-form.component.html',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class TradeFormComponent implements OnInit {
  tradeForm!: FormGroup;
  coins$: Observable<TradedCryptoData[]> = of([]);
  selectedCoin$!: Observable<TradedCryptoData | undefined>;

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
      switchMap((coinId) => this.store.select(selectCoinById(+coinId)))
    );
  }

  // Function to calculate volume when currency amount or price changes
  public calculateVolume(): void {
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
      const tradeData = this.tradeForm.getRawValue();
      console.log('Trade submitted:', tradeData);
      // Submit trade data to backend here
    }
  }
  // a function to submit the clear form
  clearForm(): void {
    this.tradeForm.reset();
  }
}
