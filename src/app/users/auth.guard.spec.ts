import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import { AuthGuard } from './auth.guard';
import { selectAuthToken } from './store/auth/auth.selectors';
import { AuthState } from './store/auth/auth.reducer';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let store: Store<AuthState>;
  let router: Router;

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
      providers: [
        AuthGuard,
        { provide: Router, useValue: routerSpy }
      ]
    });

    guard = TestBed.inject(AuthGuard);
    store = TestBed.inject(Store);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow activation if token exists', (done) => {
    spyOn(store, 'select').and.returnValue(of('valid-token'));

    guard.canActivate().subscribe((canActivate) => {
      expect(canActivate).toBeTrue();
      done();
    });
  });

  it('should navigate to root if token does not exist', (done) => {
    spyOn(store, 'select').and.returnValue(of(null));

    guard.canActivate().subscribe((canActivate) => {
      expect(canActivate).toBeFalse();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
      done();
    });
  });
});