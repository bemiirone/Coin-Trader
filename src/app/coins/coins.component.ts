import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { CoinsActions } from './store/coins.actions';
import { filter, Observable, of } from 'rxjs';
import { CoinData, PickedCryptoData } from './coins.model';
import {selectCoinError, selectCoinLoading, selectTopCoins } from './store/coins.selectors';
import { TableComponent } from './table/table.component';
import { ChartComponent } from './chart/chart.component';

@Component({
  selector: 'app-coins',
  standalone: true,
  imports: [CommonModule, TableComponent, ChartComponent],
  templateUrl: './coins.component.html',
  styleUrl: './coins.component.scss'
})
export class CoinsComponent {
  coins$: Observable<CoinData[]> = of([]);
  top50Coins$: Observable<PickedCryptoData[]> = of([]);
  loading$: Observable<boolean> = of(false);
  error$: Observable<string | null> = of(null);
  limit = 50;
  activeTab: string = 'table';

  constructor(private store: Store) {}
  ngOnInit() {
    this.store.dispatch(CoinsActions.loadCoins());
    this.loading$ = this.store.select(selectCoinLoading);
    this.error$ = this.store.select(selectCoinError);
    this.top50Coins$ = this.store.select(selectTopCoins(this.limit));
  }
  selectTab(tab: string) {
    this.activeTab = tab;
  }
}
