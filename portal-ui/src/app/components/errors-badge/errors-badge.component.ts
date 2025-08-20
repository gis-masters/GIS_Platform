import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

@Component({
  selector: 'crg-errors-badge',
  templateUrl: './errors-badge.component.html',
  styleUrls: ['./errors-badge.component.css']
})
export class ErrorsBadgeComponent implements OnInit, OnChanges {
  @Input() errors?: ValidationErrors | null;

  htmlTooltip = '';

  ngOnInit() {
    if (this.errors) {
      this.generateTooltip(this.errors);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const errorsChange = changes.errors;
    if (errorsChange && !errorsChange.isFirstChange() && errorsChange.currentValue) {
      this.generateTooltip(errorsChange.currentValue as ValidationErrors);
    }
  }

  private generateTooltip(errors: ValidationErrors) {
    if (!errors) {
      return;
    }

    this.htmlTooltip = '';
    for (const key of Object.keys(errors)) {
      this.htmlTooltip += '\n' + String(errors[key]);
    }
  }
}
