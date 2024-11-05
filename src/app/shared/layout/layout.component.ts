import { CardComponent } from './../card/card.component';
import { Component, Input } from '@angular/core';
import { CoinsComponent } from '../../coins/coins.component';
import { CommonModule } from '@angular/common';
import { ComponentType } from '../shared-models';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CoinsComponent, CardComponent,CommonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})

export class LayoutComponent {
  @Input() mainTitle = 'Coin Trading';
  @Input() sideTitle = 'Portfolio';
  @Input() componentType: ComponentType = {} as ComponentType;
}
