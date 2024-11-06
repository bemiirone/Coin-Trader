import { CardComponent } from './../card/card.component';
import { Component, Input } from '@angular/core';
import { CoinsComponent } from '../../coins/coins.component';
import { CommonModule } from '@angular/common';
import { ComponentType } from '../shared-model';
import { TradesComponent } from '../../trades/trades.component';
import { TableComponent } from '../../coins/table/table.component';
import { TradeListComponent } from '../../trades/trade-list/trade-list.component';

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
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  @Input() mainTitle = '';
  @Input() sideTitle = 'Portfolio';
  @Input() componentType: ComponentType = {} as ComponentType;
}
