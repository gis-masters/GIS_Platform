import { Component, Input } from '@angular/core';

import { cn } from '../../services/util/cn';

@Component({
  selector: 'crg-page-title',
  templateUrl: './page-title.component.html',
  styleUrls: ['./page-title.component.scss']
})
export class PageTitleComponent {
  @Input() simple?: boolean;
  cn = cn('page-title');
}
