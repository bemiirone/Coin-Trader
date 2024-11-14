import { map, Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectCoinLoading, selectCoinError } from '../../coins/store/coins.selectors';
import { Trade } from '../trades.model';

@Component({
  selector: 'app-trade-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trade-list.component.html',
  styleUrl: './trade-list.component.scss'
})
export class TradeListComponent {
  @Input() trades: Trade[] | null = [];
  loading$: Observable<boolean> = of(false);
  error$: Observable<string | null> = of(null);

  constructor(private store: Store) {
  }

  ngOnInit() {
    this.loading$ = this.store.select(selectCoinLoading);
    this.error$ = this.store.select(selectCoinError);
    console.log('Trades List', this.trades);
    
  }

}
