import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { LayoutComponent } from '../shared/layout/layout.component';
import { ComponentType } from '../shared/shared-models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, LayoutComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  title = 'Coin Trading';
  portfolioTitle = 'Portfolio';
  componentType: ComponentType = ComponentType.Coins;
}
