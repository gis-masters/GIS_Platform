import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';

import { FilterEvent } from '../../services/models';
import { OldPropertySchema } from '../../services/crg/schemaOld.models';
import { debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'crg-table-filter',
  templateUrl: './table-filter.component.html',
  styleUrls: ['./table-filter.component.css']
})
export class TableFilterComponent implements AfterViewInit, OnDestroy {
  @Input() property: OldPropertySchema;
  @Output() filterEvent = new EventEmitter<FilterEvent>();
  @ViewChild('filterInput') filterInput: ElementRef;

  selectionChangeEvent$: Subject<any> = new Subject<any>();

  private unsubscribe$: Subject<void> = new Subject<void>();

  ngAfterViewInit(): void {
    if (this.filterInput) {
      fromEvent(this.filterInput.nativeElement, 'keyup')
        .pipe(
          map((e: KeyboardEvent) => (e.target as HTMLInputElement).value),
          debounceTime(500),
          distinctUntilChanged(),
          takeUntil(this.unsubscribe$)
        )
        .subscribe(value => {
          if (value) {
            this.filterEvent.emit({ value: [value], property: this.property });
          } else {
            this.filterEvent.emit({ value: [], property: this.property });
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  isInputProperties(valueType: string): boolean {
    if (!valueType) {
      return false;
    }

    if (valueType.includes('STRING') || valueType.includes('INT') || valueType.includes('DOUBLE')) {
      return true;
    }
  }

  onSelection(event: MatSelectChange): void {
    this.selectionChangeEvent$.next(event.value);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.filterEvent.emit({ value: event.value, property: this.property });
  }
}
