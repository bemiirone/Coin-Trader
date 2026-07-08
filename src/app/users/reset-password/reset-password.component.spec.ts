import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { of, Subject } from 'rxjs';
import { ResetPasswordComponent } from './reset-password.component';
import { AuthActions } from '../store/auth/auth.actions';
import { ActivatedRoute, Router } from '@angular/router';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let store: jasmine.SpyObj<Store>;
  let router: jasmine.SpyObj<Router>;
  let successSubject: Subject<boolean>;

  beforeEach(async () => {
    successSubject = new Subject<boolean>();

    const storeSpy = jasmine.createSpyObj('Store', ['select', 'dispatch']);
    storeSpy.select.and.callFake((selector: Function) => {
      if (selector.name && selector.name.includes('ResetPasswordSuccess')) {
        return successSubject.asObservable();
      }
      return of(null);
    });

    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const routeSpy = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('reset-token-123'),
        },
      },
    };

    await TestBed.configureTestingModule({
      imports: [
        ResetPasswordComponent,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: Store, useValue: storeSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: routeSpy },
      ],
    }).compileComponents();

    store = TestBed.inject(Store) as jasmine.SpyObj<Store>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should extract token from route params on init', () => {
    expect(component.token).toBe('reset-token-123');
  });

  it('should have a resetPasswordForm with password and confirmPassword fields', () => {
    expect(component.resetPasswordForm).toBeTruthy();
    expect(component.resetPasswordForm.get('password')).toBeTruthy();
    expect(component.resetPasswordForm.get('confirmPassword')).toBeTruthy();
  });

  it('should have password field invalid when empty', () => {
    const passwordControl = component.resetPasswordForm.get('password');

    expect(passwordControl?.valid).toBe(false);
    expect(passwordControl?.errors?.['required']).toBe(true);
  });

  it('should have password field invalid when less than 6 characters', () => {
    const passwordControl = component.resetPasswordForm.get('password');
    passwordControl?.setValue('123');

    expect(passwordControl?.valid).toBe(false);
    expect(passwordControl?.errors?.['minlength']).toBeTruthy();
  });

  it('should have password field valid when 6 or more characters', () => {
    const passwordControl = component.resetPasswordForm.get('password');
    passwordControl?.setValue('password123');

    expect(passwordControl?.valid).toBe(true);
  });

  it('should have confirmPassword field invalid when empty', () => {
    const confirmPasswordControl = component.resetPasswordForm.get('confirmPassword');

    expect(confirmPasswordControl?.valid).toBe(false);
    expect(confirmPasswordControl?.errors?.['required']).toBe(true);
  });

  it('should have passwordMismatch error when passwords do not match', () => {
    component.resetPasswordForm.get('password')?.setValue('password123');
    component.resetPasswordForm.get('confirmPassword')?.setValue('different');

    expect(component.resetPasswordForm.errors?.['passwordMismatch']).toBe(true);
  });

  it('should not have passwordMismatch error when passwords match', () => {
    component.resetPasswordForm.get('password')?.setValue('password123');
    component.resetPasswordForm.get('confirmPassword')?.setValue('password123');

    expect(component.resetPasswordForm.errors).toBeNull();
    expect(component.resetPasswordForm.valid).toBe(true);
  });

  it('should dispatch resetPassword action with token and password on submit', () => {
    component.resetPasswordForm.get('password')?.setValue('newpassword');
    component.resetPasswordForm.get('confirmPassword')?.setValue('newpassword');
    component.onSubmit();

    expect(store.dispatch).toHaveBeenCalledWith(
      AuthActions.resetPassword({
        token: 'reset-token-123',
        password: 'newpassword',
      })
    );
  });

  it('should not dispatch action if form is invalid', () => {
    component.onSubmit();

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should not dispatch action if token is empty', () => {
    component.token = '';
    component.resetPasswordForm.get('password')?.setValue('newpassword');
    component.resetPasswordForm.get('confirmPassword')?.setValue('newpassword');
    component.onSubmit();

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should subscribe to success$ observable', () => {
    expect(component.success$).toBeTruthy();
  });

  it('should subscribe to error$ observable', () => {
    expect(component.error$).toBeTruthy();
  });
});
