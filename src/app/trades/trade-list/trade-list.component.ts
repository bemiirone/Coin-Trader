import { map, Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectCoinLoading, selectCoinError } from '../../coins/store/coins.selectors';
import { Trade } from '../trades.model';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TradeFormComponent } from '../trade-form/trade-form.component';
import { User } from '../../users/user.model';
import { selectSelectedUser } from '../../users/store/user.selectors';

@Component({
  selector: 'app-trade-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './trade-list.component.html',
  styleUrl: './trade-list.component.scss'
})
export class TradeListComponent {
  @Input() trades: Trade[] | null = [];
  @Input()user: User | null = {} as User;
  loading$: Observable<boolean> = of(false);
  error$: Observable<string | null> = of(null);
  modalRef: BsModalRef | null = null;

  constructor(private store: Store, private modalService: BsModalService) {
  }

  ngOnInit() {
    this.loading$ = this.store.select(selectCoinLoading);
    this.error$ = this.store.select(selectCoinError);
  }


  openModal(): void {
    if (!this.user) {
      console.error('User data not available!');
      return;
    }

    this.modalRef = this.modalService.show(TradeFormComponent, {
      backdrop: true,
      initialState: {
        user: this.user,
      },
    });
  }

  ngOnDestroy(): void {
    this.store.select(selectSelectedUser).subscribe().unsubscribe();
  }
}
