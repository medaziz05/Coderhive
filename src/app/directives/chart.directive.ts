import { Directive, ElementRef, Input, OnChanges } from '@angular/core';
import {
  Chart,
  ChartConfiguration,
  registerables
} from 'chart.js';

// ⚠️ Nécessaire pour que Chart.js sache gérer les types (pie, bar, etc.)
Chart.register(...registerables);

@Directive({
  selector: '[appChart]'
})
export class ChartDirective implements OnChanges {
  @Input() chartData!: ChartConfiguration;

  private chart: Chart | undefined;

  constructor(private el: ElementRef) {}

  ngOnChanges(): void {
    if (this.chart) {
      this.chart.destroy();
    }

    const ctx = this.el.nativeElement.getContext('2d');
    if (ctx && this.chartData) {
      this.chart = new Chart(ctx, this.chartData);
    }
  }
}
