import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { selectPortfolioPercentageDiff, selectTopTrades, selectUserCash, selectUserPortfolioTotal, selectUserTradesValue } from '../trades/store/trades.selectors';
import { CommonModule } from '@angular/common';
import { Trade } from '../trades/trades.model';

// Extend Trade interface with a value property
interface TradeV extends Trade {
  value: number;
}

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss'
})
export class PortfolioComponent {
  constructor(private store: Store) {}
  tradeNumber = 8;
  portfolioValue$: Observable<number> = of(0);
  yield$: Observable<number> = of(0);
  cashBalance$: Observable<number> = of(0);
  tradesValue$: Observable<number> = of(0);
  topTrades$: Observable<TradeV[]> = of([]);

  ngOnInit(): void {
    this.portfolioValue$ = this.store.select(selectUserPortfolioTotal);
    this.yield$ = this.store.select(selectPortfolioPercentageDiff);
    this.cashBalance$ = this.store.select(selectUserCash);
    this.tradesValue$ = this.store.select(selectUserTradesValue);
    this.topTrades$ = this.store.select(selectTopTrades(this.tradeNumber));
  }
}
