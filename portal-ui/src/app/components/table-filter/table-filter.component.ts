import {FilterEvent} from '../../services/models/requestModel';
import {SimpleProperty} from '../../services/gis/fgistp-rules.service';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'crg-table-filter',
  templateUrl: './table-filter.component.html',
  styleUrls: ['./table-filter.component.css']
})
export class TableFilterComponent implements OnInit {

  @Input() property: SimpleProperty;
  @Output() filterEvent = new EventEmitter<FilterEvent>();

  constructor() { }

  ngOnInit() {
    // console.log('-');
  }

  onChange(value: string) {
    console.log('value', value);
    this.filterEvent.emit({value: value, property: this.property});
  }

  onKeyUp(value: string) {
    console.log('value: ', value);
    this.filterEvent.emit({value: value, property: this.property});
  }
}
