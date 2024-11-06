import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {selectUserPortfolio} from '../store/trades.selectors';
import { Store } from '@ngrx/store';
import { CoinData, TradedCryptoData } from '../../coins/coins.model';
import { AnyMxRecord } from 'dns';
import { CoinsActions } from '../../coins/store/coins.actions';
import { selectCoinLoading, selectCoinError } from '../../coins/store/coins.selectors';

@Component({
  selector: 'app-trade-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trade-list.component.html',
  styleUrl: './trade-list.component.scss'
})
export class TradeListComponent {
  trades$: Observable<any> = of([]);
  loading$: Observable<boolean> = of(false);
  error$: Observable<string | null> = of(null);

  constructor(private store: Store) {
  }

  ngOnInit() {
    this.store.dispatch(CoinsActions.loadCoins());
    this.loading$ = this.store.select(selectCoinLoading);
    this.error$ = this.store.select(selectCoinError);
    this.trades$ = this.store.select(selectUserPortfolio);
    this.trades$.subscribe(trades => {
      console.log('Trades:', trades);
    });
  }

}
