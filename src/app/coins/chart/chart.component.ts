import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { PickedCryptoData } from '../coins.model';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss'
})
export class ChartComponent {
  @Input() coins: PickedCryptoData[] = [];
  title = '7 Day Performance';
  dataLabels = ['One Day Performance', 'Seven Day Performance'];
  barChartLegend = true;
  barChartPlugins = [];
  coinNames: string[] = [];
  oneDayPerformance: number[] = [];
  sevenDayPerformance: number[] = [];

  ngOnInit() {
    this.coins.forEach(coin => {
      this.coinNames.push(coin.name);
      this.sevenDayPerformance.push(coin.percent_change_7d);
      this.oneDayPerformance.push(coin.percent_change_24h);
    });

  }

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: this.coinNames,
    datasets: [
      { data: this.oneDayPerformance, label: this.dataLabels[0] },
      { data: this.sevenDayPerformance, label: this.dataLabels[1] },
    ]
  }

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
  };

}
