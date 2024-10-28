import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { PickedCryptoData } from '../coins.model';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent {
  @Input() coins$: Observable<PickedCryptoData[]> = of([]);
  constructor() {}

}
