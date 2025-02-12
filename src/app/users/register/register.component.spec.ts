import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register.component';
import { Store } from '@ngrx/store';
import { UserActions } from '../store/user.actions';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { selectIsRegistering, selectAddUserSuccess } from '../store/user.selectors';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let store: MockStore;

  const initialState = {
    users: {
      isRegistering: false,
      addUserSuccess: false
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RegisterComponent
      ],
      providers: [
        provideMockStore({ initialState })
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.registerForm.value).toEqual({
      name: '',
      email: '',
      password: '',
      deposit: ''
    });
  });

  it('should mark form as invalid when empty', () => {
    expect(component.registerForm.valid).toBeFalse();
  });

  it('should mark form as valid with correct values', () => {
    component.registerForm.patchValue({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      deposit: 150000
    });

    expect(component.registerForm.valid).toBeTrue();
  });

  it('should dispatch addUser action on valid form submission', () => {
    const storeSpy = spyOn(store, 'dispatch');
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      deposit: 150000,
      admin: false
    };

    component.registerForm.patchValue({
      name: testUser.name,
      email: testUser.email,
      password: testUser.password,
      deposit: testUser.deposit
    });

    component.onSubmit();

    expect(storeSpy).toHaveBeenCalledWith(
      UserActions.addUser({ user: testUser })
    );
  });

  it('should not dispatch addUser action on invalid form submission', () => {
    const storeSpy = spyOn(store, 'dispatch');
    component.onSubmit();
    expect(storeSpy).not.toHaveBeenCalled();
  });

  it('should validate minimum deposit amount', () => {
    component.registerForm.patchValue({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      deposit: 10000
    });

    const depositControl = component.registerForm.get('deposit');
    expect(depositControl?.errors?.['min']).toBeTruthy();
    expect(depositControl?.errors?.['min']).toEqual({
      min: 100000,
      actual: 10000
    });
  });
});
