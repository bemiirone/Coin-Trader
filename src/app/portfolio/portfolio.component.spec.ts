import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PortfolioComponent } from './portfolio.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import {
  selectPortfolioPercentageDiff,
  selectTopTrades,
  selectUserCash,
  selectUserPortfolioTotal,
  selectUserBuyTradesValue,
} from '../trades/store/trades.selectors';

describe('PortfolioComponent', () => {
  let component: PortfolioComponent;
  let fixture: ComponentFixture<PortfolioComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfolioComponent],
      providers: [provideMockStore()],
    }).compileComponents();
  
    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(PortfolioComponent);
    component = fixture.componentInstance;
  
    // Mock selectors
    store.overrideSelector(selectUserPortfolioTotal, 1000);
    store.overrideSelector(selectPortfolioPercentageDiff, 10);
    store.overrideSelector(selectUserCash, 500);
    store.overrideSelector(selectUserBuyTradesValue, 200);
    store.overrideSelector(selectTopTrades(10), []);
  
    // Mock observables
    component.portfolioValue$ = of(1000);
    component.yield$ = of(10);
    component.cashBalance$ = of(500);
    component.tradesValue$ = of(200);
    component.topTrades$ = of([]);
  
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display mocked observable values in the template', () => {
    fixture.detectChanges(); // Trigger change detection

    const compiled = fixture.nativeElement as HTMLElement;

    // Assert template renders values from the observables
    const portfolioValue = compiled.querySelector('.portfolio-value')?.textContent;
    const cashBalance = compiled.querySelector('.cash-balance')?.textContent;
    const coinsValue = compiled.querySelector('.trades-value')?.textContent;
    const yieldValue = compiled.querySelector('.yield')?.textContent;

    expect(portfolioValue).toContain('$1,000.00'); 
    expect(cashBalance).toContain('500.00'); 
    expect(coinsValue).toContain('200.00'); 
    expect(yieldValue).toContain('10.00'); 
  });

  it('should use mocked observable values in component logic', (done) => {
    // Test if observables emit the expected values
    component.portfolioValue$.subscribe((value) => {
      expect(value).toBe(1000);
      done(); 
    });
    component.yield$.subscribe((value) => {
      expect(value).toBe(10);
    });
    component.cashBalance$.subscribe((value) => {
      expect(value).toBe(500);
    });
    component.tradesValue$.subscribe((value) => {
      expect(value).toBe(200);
    });
    component.topTrades$.subscribe((value) => {
      expect(value).toEqual([]);
    });
  });
  
});
