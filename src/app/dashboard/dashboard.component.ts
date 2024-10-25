import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CardComponent } from '../shared/card/card.component';
import { CoinsComponent } from '../coins/coins.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardComponent, CoinsComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  title = 'Dashboard';
  coinsTitle = 'Coin Trading';
  portfolioTitle = 'Portfolio';
}
