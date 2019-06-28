import {fromEvent} from 'rxjs';
import {FilterEvent} from '../../services/models/requestModel';
import {SimpleProperty} from '../../services/gis/fgistp-rules.service';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import {AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'crg-table-filter',
  templateUrl: './table-filter.component.html',
  styleUrls: ['./table-filter.component.css']
})
export class TableFilterComponent implements AfterViewInit {

  @Input() property: SimpleProperty;
  @Output() filterEvent = new EventEmitter<FilterEvent>();
  @ViewChild('filterInput') filterInput: ElementRef;
  @ViewChild('filterSelect') filterSelect: ElementRef;

  constructor() {
  }

  ngAfterViewInit(): void {
    console.log('prop:', this.property);

    if (this.filterInput) {
      fromEvent(this.filterInput.nativeElement, 'keyup')
        .pipe(
          map((e: any) => e.target.value),
          debounceTime(500),
          distinctUntilChanged()
        )
        .subscribe(value => {
          this.filterEvent.emit({value: value, property: this.property});
        });
    }

    if (this.filterSelect) {
      fromEvent(this.filterSelect.nativeElement, 'change')
        .pipe(
          map((e: any) => e.target.value),
          debounceTime(100),
          distinctUntilChanged()
        )
        .subscribe(value => {
          this.filterEvent.emit({value: value, property: this.property});
        });
    }
  }

  isInputProperties(valueType: string) {
    if (!valueType) {
      return false;
    }

    if (valueType.includes('STRING') ||
        valueType.includes('INT') ||
        valueType.includes('DOUBLE')) {
      return true;
    }
  }
}
