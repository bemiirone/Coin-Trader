
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { PickedCryptoData } from '../coins.model';

@Component({
  selector: 'app-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BaseChartDirective],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss'
})
export class ChartComponent implements OnChanges {
  @Input() coins: PickedCryptoData[] = [];
  title = '7 Day Performance';
  dataLabels = ['One Day Performance', 'Seven Day Performance'];
  barChartLegend = true;
  barChartPlugins = [];

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      { data: [], label: this.dataLabels[0] },
      { data: [], label: this.dataLabels[1] },
    ]
  }

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['coins'] && this.coins) {
      this.updateChartData();
    }
  }

  private updateChartData(): void {
    const coinNames: string[] = [];
    const oneDayPerformance: number[] = [];
    const sevenDayPerformance: number[] = [];

    this.coins.forEach(coin => {
      coinNames.push(coin.name);
      sevenDayPerformance.push(coin.percent_change_7d);
      oneDayPerformance.push(coin.percent_change_24h);
    });

    this.barChartData = {
      labels: coinNames,
      datasets: [
        { data: oneDayPerformance, label: this.dataLabels[0] },
        { data: sevenDayPerformance, label: this.dataLabels[1] },
      ]
    };
  }

}
