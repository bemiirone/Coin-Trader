import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { ForgotPasswordComponent } from './forgot-password.component';
import { AuthActions } from '../store/auth/auth.actions';
import { RouterTestingModule } from '@angular/router/testing';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let store: jasmine.SpyObj<Store>;

  beforeEach(async () => {
    const storeSpy = jasmine.createSpyObj('Store', ['select', 'dispatch']);
    storeSpy.select.and.returnValues(
      of(false),
      of(null)
    );

    await TestBed.configureTestingModule({
      imports: [
        ForgotPasswordComponent,
        ReactiveFormsModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: Store, useValue: storeSpy },
      ],
    }).compileComponents();

    store = TestBed.inject(Store) as jasmine.SpyObj<Store>;
    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a forgotPasswordForm with email field', () => {
    expect(component.forgotPasswordForm).toBeTruthy();
    expect(component.forgotPasswordForm.get('email')).toBeTruthy();
  });

  it('should have email field invalid when empty', () => {
    const emailControl = component.forgotPasswordForm.get('email');

    expect(emailControl?.valid).toBe(false);
    expect(emailControl?.errors?.['required']).toBe(true);
  });

  it('should have email field invalid when not a valid email', () => {
    const emailControl = component.forgotPasswordForm.get('email');
    emailControl?.setValue('invalid-email');

    expect(emailControl?.valid).toBe(false);
    expect(emailControl?.errors?.['email']).toBe(true);
  });

  it('should have email field valid when valid email', () => {
    const emailControl = component.forgotPasswordForm.get('email');
    emailControl?.setValue('test@example.com');

    expect(emailControl?.valid).toBe(true);
  });

  it('should dispatch forgotPassword action with email on submit', () => {
    component.forgotPasswordForm.get('email')?.setValue('test@example.com');
    component.onSubmit();

    expect(store.dispatch).toHaveBeenCalledWith(
      AuthActions.forgotPassword({ email: 'test@example.com' })
    );
  });

  it('should reset form after submission', () => {
    component.forgotPasswordForm.get('email')?.setValue('test@example.com');
    component.onSubmit();

    expect(component.forgotPasswordForm.get('email')?.value).toBeNull();
  });

  it('should not dispatch action if form is invalid', () => {
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
