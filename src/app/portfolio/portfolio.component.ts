import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { selectPortfolioPercentageDiff, selectTopTrades, selectUserCash, selectUserPortfolioTotal, selectUserBuyTradesValue } from '../trades/store/trades.selectors';
import { CommonModule } from '@angular/common';
import { Trade } from '../trades/trades.model';

// Extend Trade interface with a value property

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss'
})
export class PortfolioComponent {
  constructor(private store: Store) {}
  tradeNumber = 10;
  portfolioValue$: Observable<number> = of(0);
  yield$: Observable<number> = of(0);
  cashBalance$: Observable<number> = of(0);
  tradesValue$: Observable<number> = of(0);
  topTrades$: Observable<Trade[]> = of([]);

  ngOnInit(): void {
    this.portfolioValue$ = this.store.select(selectUserPortfolioTotal);
    this.yield$ = this.store.select(selectPortfolioPercentageDiff);
    this.cashBalance$ = this.store.select(selectUserCash);
    this.tradesValue$ = this.store.select(selectUserBuyTradesValue);
    this.topTrades$ = this.store.select(selectTopTrades(this.tradeNumber));
  }
}
