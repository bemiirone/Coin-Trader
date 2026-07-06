import { CoinsComponent } from './coins.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table/table.component';
import { ChartComponent } from './chart/chart.component';
import { provideMockStore } from '@ngrx/store/testing';
import { selectTopCoins, selectCoinLoading, selectCoinError } from './store/coins.selectors';

describe('CoinsComponent', () => {
  let component: CoinsComponent;
  let fixture: ComponentFixture<CoinsComponent>;

  const mockPickedCoins = [
    {
      name: 'Bitcoin',
      price: 50000,
      percent_change_1h: 0.5,
      percent_change_24h: 2.3,
      percent_change_7d: 5.1,
      market_cap: 1000000000,
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, TableComponent, ChartComponent, CoinsComponent],
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectTopCoins(20), value: mockPickedCoins },
            { selector: selectCoinLoading, value: false },
            { selector: selectCoinError, value: null },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CoinsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set activeTab to the tab passed in', () => {
    component.selectTab('chart');
    expect(component.activeTab).toBe('chart');
  });

  it('should initialize with default values', () => {
    expect(component.activeTab).toBe('table');
    expect(component.limit).toBe(20);
  });
});
