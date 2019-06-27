import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'crg-table-filter',
  templateUrl: './table-filter.component.html',
  styleUrls: ['./table-filter.component.css']
})
export class TableFilterComponent implements OnInit {

  @Input() propertyName: any;

  constructor() { }

  ngOnInit() {
    console.log('value', this.propertyName);
  }

}
