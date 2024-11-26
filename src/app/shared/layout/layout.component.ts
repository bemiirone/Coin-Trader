import { CardComponent } from './../card/card.component';
import { Component, input, Input } from '@angular/core';
import { CoinsComponent } from '../../coins/coins.component';
import { CommonModule } from '@angular/common';
import { ComponentType } from '../shared-model';
import { TradesComponent } from '../../trades/trades.component';
import { TableComponent } from '../../coins/table/table.component';
import { TradeListComponent } from '../../trades/trade-list/trade-list.component';
import { User } from '../../users/user.model';
import { Trade } from '../../trades/trades.model';
import { PortfolioComponent } from '../../portfolio/portfolio.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CoinsComponent,
    CardComponent,
    CommonModule,
    TradesComponent,
    TradeListComponent,
    TableComponent,
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
}
