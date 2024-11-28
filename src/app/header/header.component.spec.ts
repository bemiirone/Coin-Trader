import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // test user is passed to the component
  it('should have a user input', () => {
    expect(component.user).toBeDefined();
  });

  // test user is displayed in the template
  it('should display the user name', () => {
    component.user = { 
      _id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      admin: false,
      portfolio_total: 1000,
      deposit: 500,
      cash: 200,
    };
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.user-name').textContent).toContain('John Doe');
  });
});
