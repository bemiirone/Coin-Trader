import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Chart, BarController, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js';

import { ChartComponent } from './chart.component';

describe('ChartComponent', () => {
  let component: ChartComponent;
  let fixture: ComponentFixture<ChartComponent>;

  beforeAll(() => {
    Chart.register(BarController, CategoryScale, LinearScale, BarElement, Tooltip);
  });

  afterAll(() => {
    Chart.unregister([BarController, CategoryScale, LinearScale, BarElement, Tooltip]);
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
