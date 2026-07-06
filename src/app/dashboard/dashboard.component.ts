
import { Component, Input } from '@angular/core';
import { LayoutComponent } from '../shared/layout/layout.component';
import { ComponentType } from '../shared/shared-model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [LayoutComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  title = 'Coin Trading';
  portfolioTitle = 'Portfolio';
  componentType: ComponentType = ComponentType.Coins;
}
