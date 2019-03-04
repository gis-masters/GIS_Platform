import {ValidationErrors} from '@angular/forms';
import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'crg-errors-badge',
  templateUrl: './errors-badge.component.html',
  styleUrls: ['./errors-badge.component.css']
})
export class ErrorsBadgeComponent implements OnInit {

  @Input() errors: ValidationErrors | null;

  htmlTooltip = '';

  constructor() {
  }

  ngOnInit() {
    for (const key of Object.keys(this.errors)) {
      this.htmlTooltip += '\n' + this.errors[key];
    }
  }
}
