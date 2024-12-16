import { CardComponent } from './../card/card.component';
import { Component, Input } from '@angular/core';
import { CoinsComponent } from '../../coins/coins.component';
import { CommonModule } from '@angular/common';
import { ComponentType } from '../shared-model';
import { TradeListComponent } from '../../trades/trade-list/trade-list.component';
import { User } from '../../users/user.model';
import { Trade } from '../../trades/trades.model';
import { PortfolioComponent } from '../../portfolio/portfolio.component';
import { Observable } from 'rxjs';
import { selectAuthUser } from '../../users/store/auth/auth.selectors';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CoinsComponent,
    CardComponent,
    CommonModule,
    TradeListComponent,
    PortfolioComponent
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  @Input() mainTitle = '';
  @Input() sideTitle = 'Account value';
  @Input() componentType: ComponentType = {} as ComponentType;
  @Input() user: User | null  = {} as User;
  @Input() trades: Trade[] | null = [];
  authUser$!: Observable<User | null>;

  constructor( private store: Store) {}

  ngOnInit() {
    this.authUser$ = this.store.select(selectAuthUser);
  }
}
