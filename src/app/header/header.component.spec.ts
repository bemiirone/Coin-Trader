import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import { HeaderComponent } from './header.component';
import { User } from '../users/user.model';
import { AuthActions } from '../users/store/auth/auth.actions';
import { selectAuthUser } from '../users/store/auth/auth.selectors';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, StoreModule.forRoot({}), HeaderComponent],
    }).compileComponents();

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize user$ and loginForm on ngOnInit', () => {
    const user: User = {
      _id: '1', name: 'Test User', email: 'test@example.com',
      password: '',
      admin: false,
      portfolio_total: 0,
      deposit: 0,
      cash: 0
    };
    spyOn(store, 'select').and.returnValue(of(user));

    component.ngOnInit();

    component.user$.subscribe((result) => {
      expect(result).toEqual(user);
    });

    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.controls['email']).toBeDefined();
    expect(component.loginForm.controls['password']).toBeDefined();
  });

  it('should dispatch login action on valid form submission', () => {
    spyOn(store, 'dispatch').and.callThrough();

    component.ngOnInit();
    component.loginForm.setValue({ email: 'test@example.com', password: 'password' });

    component.onLogin();

    expect(store.dispatch).toHaveBeenCalledWith(
      AuthActions.login({ email: 'test@example.com', password: 'password' })
    );
  });

  it('should not dispatch login action on invalid form submission', () => {
    spyOn(store, 'dispatch').and.callThrough();

    component.ngOnInit();
    component.loginForm.setValue({ email: '', password: '' });

    component.onLogin();

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should dispatch logout action on logout', () => {
    spyOn(store, 'dispatch').and.callThrough();

    component.onLogout();

    expect(store.dispatch).toHaveBeenCalledWith(AuthActions.logout());
  });
});
