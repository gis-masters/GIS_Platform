import { Component, Input } from '@angular/core';

@Component({
  selector: 'crg-loading',
  templateUrl: './loading-ng.component.html',
  styleUrls: ['./loading-ng.component.scss']
})
export class LoadingNgComponent {
  @Input() percents?: string;
  @Input() noBackdrop?: boolean;

  get hasPercents(): boolean {
    return (typeof this.percents === 'string' && Boolean(this.percents)) || typeof this.percents === 'number';
  }
}
