import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { CoinsActions } from './store/coins.actions';

@Component({
  selector: 'app-coins',
  standalone: true,
  imports: [],
  templateUrl: './coins.component.html',
  styleUrl: './coins.component.scss'
})
export class CoinsComponent {
  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(CoinsActions.loadCoins());
  }
}
