import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { TradesEffects } from './trades.effects';

describe('TradesEffects', () => {
  let actions$: Observable<any>;
  let effects: TradesEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TradesEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(TradesEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
