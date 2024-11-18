import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { selectPortfolioPercentageDiff, selectUserPortfolioValue } from '../trades/store/trades.selectors';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss'
})
export class PortfolioComponent {
  constructor(private store: Store) {}
  portfolioValue$: Observable<number> = of(0);
  yield$: Observable<number> = of(0);

  ngOnInit(): void {
    this.portfolioValue$ = this.store.select(selectUserPortfolioValue);
    this.yield$ = this.store.select(selectPortfolioPercentageDiff);
  }
}
