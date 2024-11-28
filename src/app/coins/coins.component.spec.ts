import { CoinsComponent } from './coins.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table/table.component';
import { ChartComponent } from './chart/chart.component';
import { Store } from '@ngrx/store';

class MockStore {
  select = jasmine.createSpy().and.returnValue({});
  dispatch = jasmine.createSpy();
}

describe('CoinsComponent', () => {
  let component: CoinsComponent;
  let fixture: ComponentFixture<CoinsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, TableComponent, ChartComponent, CoinsComponent], // CoinsComponent imported as standalone
      providers: [
        { provide: Store, useClass: MockStore }, // Mock Store instead of the real one
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CoinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set activeTab to the tab passed in', () => {
    component.selectTab('chart');
    expect(component.activeTab).toBe('chart');
  });

  it('should initialize with default values in ngOnInit', () => {
    expect(component.activeTab).toBe('table'); // Default tab is 'table'
    expect(component.limit).toBe(20); // Default limit value
  });

  // test to check app-table components are rendered when activeTab is 'table'
  it('should render app-table component when activeTab is table', () => {
    component.activeTab = 'table';
    fixture.detectChanges();
    const tableComponent = fixture.nativeElement.querySelector('app-table');
    expect(tableComponent).toBeTruthy();
  });

  // test to check app-chart components are rendered when activeTab is 'chart'
  it('should render app-chart component when activeTab is chart', () => {
    component.activeTab = 'chart';
    fixture.detectChanges();
    const chartComponent = fixture.nativeElement.querySelector('app-chart');
    expect(chartComponent).toBeTruthy();
  });

});
