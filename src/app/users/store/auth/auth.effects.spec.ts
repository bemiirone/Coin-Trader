import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { AuthEffects } from './auth.effects';
import { AuthActions } from './auth.actions';
import { UserService } from '../../user.service';
import { Store } from '@ngrx/store';
import { CoinsActions } from '../../../coins/store/coins.actions';
import { cold, hot } from 'jasmine-marbles';

describe('AuthEffects', () => {
  let actions$: Observable<any>;
  let effects: AuthEffects;
  let userService: jasmine.SpyObj<UserService>;
  let store: jasmine.SpyObj<Store>;
  const user = {
    _id: '1',
    name: 'Test User',
    email: 'test@example.com',
    password: 'password',
    admin: false,
    portfolio_total: 0,
    deposit: 0,
    cash: 0,
  };

  beforeEach(() => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['login', 'forgotPassword', 'resetPassword']);
    const storeSpy = jasmine.createSpyObj('Store', ['dispatch']);

    TestBed.configureTestingModule({
      providers: [
        AuthEffects,
        provideMockActions(() => actions$),
        { provide: UserService, useValue: userServiceSpy },
        { provide: Store, useValue: storeSpy },
      ],
    });

    effects = TestBed.inject(AuthEffects);
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    store = TestBed.inject(Store) as jasmine.SpyObj<Store>;
  });

  it('should dispatch loginSuccess on successful login', () => {
    
    const token = 'test-token';
    const loginAction = AuthActions.login({
      email: 'test@example.com',
      password: 'password',
    });
    const loginSuccessAction = AuthActions.loginSuccess({ user, token });

    actions$ = hot('-a-', { a: loginAction });
    const response = cold('-a|', { a: { user, token } });
    userService.login.and.returnValue(response);

    const expected = cold('--b', { b: loginSuccessAction });

    expect(effects.login$).toBeObservable(expected);
  });

  it('should dispatch loginFailure on login error', () => {
    const loginAction = AuthActions.login({
      email: 'test@example.com',
      password: 'password',
    });
    const error = new Error('Login failed');
    const loginFailureAction = AuthActions.loginFailure({ error: 'Login failed' });

    actions$ = hot('-a-', { a: loginAction });
    const response = cold('-#|', {}, error);
    userService.login.and.returnValue(response);

    const expected = cold('--b', { b: loginFailureAction });

    expect(effects.login$).toBeObservable(expected);
  });

  it('should dispatch logoutSuccess on logout', () => {
    const logoutAction = AuthActions.logout();
    const logoutSuccessAction = AuthActions.logoutSuccess();

    actions$ = hot('-a-', { a: logoutAction });

    const expected = cold('-b', { b: logoutSuccessAction });

    expect(effects.logout$).toBeObservable(expected);
  });

  it('should dispatch loginSuccess if token and user are in localStorage', () => {
    const token = 'test-token';
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'authUser') {
        return JSON.stringify(user);
      }
      if (key === 'authToken') return token;
      return null;
    });
  
    const loadCoinsSuccessAction = CoinsActions.loadCoinsSuccess({} as any);
    const loginSuccessAction = AuthActions.loginSuccess({ user, token });
  
    actions$ = hot('-a-', { a: loadCoinsSuccessAction });
  
    const expected = cold('-b', { b: loginSuccessAction });
  
    expect(effects.initializeAuth$).toBeObservable(expected);
  });
  

  it('should dispatch noop if token and user are not in localStorage', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);

    const loadCoinsSuccessAction = CoinsActions.loadCoinsSuccess({} as any);
    const noopAction = AuthActions.noop();

    actions$ = hot('-a-', { a: loadCoinsSuccessAction });

    const expected = cold('-b', { b: noopAction });

    expect(effects.initializeAuth$).toBeObservable(expected);
  });

  describe('forgotPassword$', () => {
    it('should dispatch forgotPasswordSuccess on successful request', () => {
      const forgotPasswordAction = AuthActions.forgotPassword({ email: 'test@example.com' });
      const successAction = AuthActions.forgotPasswordSuccess();

      actions$ = hot('-a-', { a: forgotPasswordAction });
      const response = cold('-a|', { a: { message: 'Reset link sent' } });
      userService.forgotPassword.and.returnValue(response);

      const expected = cold('--b', { b: successAction });

      expect(effects.forgotPassword$).toBeObservable(expected);
    });

    it('should dispatch forgotPasswordFailure on error', () => {
      const forgotPasswordAction = AuthActions.forgotPassword({ email: 'test@example.com' });
      const error = new Error('Network error');
      const failureAction = AuthActions.forgotPasswordFailure({ error: 'Network error' });

      actions$ = hot('-a-', { a: forgotPasswordAction });
      const response = cold('-#|', {}, error);
      userService.forgotPassword.and.returnValue(response);

      const expected = cold('--b', { b: failureAction });

      expect(effects.forgotPassword$).toBeObservable(expected);
    });
  });

  describe('resetPassword$', () => {
    it('should dispatch resetPasswordSuccess on successful reset', () => {
      const resetPasswordAction = AuthActions.resetPassword({ token: 'reset-token', password: 'newpassword' });
      const successAction = AuthActions.resetPasswordSuccess();

      actions$ = hot('-a-', { a: resetPasswordAction });
      const response = cold('-a|', { a: { message: 'Password reset successful' } });
      userService.resetPassword.and.returnValue(response);

      const expected = cold('--b', { b: successAction });

      expect(effects.resetPassword$).toBeObservable(expected);
    });

    it('should dispatch resetPasswordFailure on error', () => {
      const resetPasswordAction = AuthActions.resetPassword({ token: 'reset-token', password: 'newpassword' });
      const error = new Error('Invalid token');
      const failureAction = AuthActions.resetPasswordFailure({ error: 'Invalid token' });

      actions$ = hot('-a-', { a: resetPasswordAction });
      const response = cold('-#|', {}, error);
      userService.resetPassword.and.returnValue(response);

      const expected = cold('--b', { b: failureAction });

      expect(effects.resetPassword$).toBeObservable(expected);
    });
  });
});
