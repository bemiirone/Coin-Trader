import { Component } from '@angular/core';
import { ComponentType } from '../shared/shared-model';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from '../shared/layout/layout.component';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { CoinsActions } from '../coins/store/coins.actions';
import {
  selectCoinLoading,
  selectCoinError,
} from '../coins/store/coins.selectors';
import { selectUserPortfolio } from './store/trades.selectors';

@Component({
  selector: 'app-trades',
  standalone: true,
  imports: [CommonModule, LayoutComponent],
  templateUrl: './trades.component.html',
  styleUrl: './trades.component.scss',
})
export class TradesComponent {
  title = 'My Trades';
  portfolioTitle = 'Portfolio';
  componentType: ComponentType = ComponentType.Trades;
  trades$: Observable<any> = of([]);
  loading$: Observable<boolean> = of(false);
  error$: Observable<string | null> = of(null);

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(CoinsActions.loadCoins());
    this.loading$ = this.store.select(selectCoinLoading);
    this.error$ = this.store.select(selectCoinError);
    this.trades$ = this.store.select(selectUserPortfolio);
    this.trades$.subscribe((trades) => {
      console.log('Trades:', trades);
    });
  }
}
