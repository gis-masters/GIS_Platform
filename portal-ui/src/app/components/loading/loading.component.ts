import { Component, Input } from '@angular/core';

@Component({
  selector: 'crg-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent {
  @Input() percents: string;
  @Input() noBackdrop: boolean;

  get hasPercents(): boolean {
    return (typeof this.percents === 'string' && Boolean(this.percents)) || typeof this.percents === 'number';
  }
}
