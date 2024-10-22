import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { CoinsEffects } from './coins.effects';

describe('CoinsEffects', () => {
  let actions$: Observable<any>;
  let effects: CoinsEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CoinsEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(CoinsEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
