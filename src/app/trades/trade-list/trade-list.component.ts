import { map, Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectCoinLoading, selectCoinError } from '../../coins/store/coins.selectors';
import { Trade } from '../trades.model';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TradeFormComponent } from '../trade-form/trade-form.component';

@Component({
  selector: 'app-trade-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trade-list.component.html',
  styleUrl: './trade-list.component.scss'
})
export class TradeListComponent {
  @Input() trades: Trade[] | null = [];
  loading$: Observable<boolean> = of(false);
  error$: Observable<string | null> = of(null);
  modalRef: BsModalRef | null = null;

  constructor(private store: Store, private modalService: BsModalService) {
  }

  ngOnInit() {
    this.loading$ = this.store.select(selectCoinLoading);
    this.error$ = this.store.select(selectCoinError);
    console.log('Trades List', this.trades);
  }

  openModal(): void {
    this.modalRef = this.modalService.show(TradeFormComponent, {
      backdrop: true, // Adds a backdrop
    });
  }

}
