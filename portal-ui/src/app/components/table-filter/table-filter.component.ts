import {fromEvent, Subject} from 'rxjs';
import {FilterEvent} from '../../services/models/requestModel';
import {SimpleProperty} from '../../services/crg/data-schema.service';
import {debounceTime, distinctUntilChanged, map, takeUntil} from 'rxjs/operators';
import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild} from '@angular/core';
import {MatSelectChange} from '@angular/material';

@Component({
  selector: 'crg-table-filter',
  templateUrl: './table-filter.component.html',
  styleUrls: ['./table-filter.component.css']
})
export class TableFilterComponent implements AfterViewInit, OnDestroy {

  @Input() property: SimpleProperty;
  @Output() filterEvent = new EventEmitter<FilterEvent>();
  @ViewChild('filterInput') filterInput: ElementRef;

  selectionChangeEvent$: Subject<any> = new Subject<any>();

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor() {
  }

  ngAfterViewInit(): void {
    if (this.filterInput) {
      fromEvent(this.filterInput.nativeElement, 'keyup')
        .pipe(
          map((e: any) => e.target.value),
          debounceTime(500),
          distinctUntilChanged(),
          takeUntil(this.unsubscribe$)
        )
        .subscribe(value => {
          if (!!value) {
            this.filterEvent.emit({value: [value], property: this.property});
          } else {
            this.filterEvent.emit({value: [], property: this.property});
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
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

  onSelection(event: MatSelectChange) {
    this.selectionChangeEvent$.next(event.value);
    this.filterEvent.emit({value: event.value, property: this.property});
  }
}
