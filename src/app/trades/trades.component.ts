import { Component } from '@angular/core';
import { ComponentType } from '../shared/shared-model';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from '../shared/layout/layout.component';

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
}
