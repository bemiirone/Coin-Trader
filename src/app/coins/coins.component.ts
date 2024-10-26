import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { CoinsActions } from './store/coins.actions';
import { filter, Observable, of } from 'rxjs';
import { CoinData } from './coins.model';
import { selectCoinData, selectCoinError, selectCoinLoading } from './store/coins.selectors';

@Component({
  selector: 'app-coins',
  standalone: true,
  imports: [],
  templateUrl: './coins.component.html',
  styleUrl: './coins.component.scss'
})
export class CoinsComponent {
  coins$: Observable<CoinData[]> = of([]);
  loading$: Observable<boolean> = of(false);
  error$: Observable<string | null> = of(null);

  constructor(private store: Store) {}
  ngOnInit() {
    this.store.dispatch(CoinsActions.loadCoins());
    this.coins$ = this.store.select(selectCoinData).pipe(
      filter((data): data is CoinData[] => data !== undefined)
    );
    this.loading$ = this.store.select(selectCoinLoading);
    this.error$ = this.store.select(selectCoinError);
  }
}
