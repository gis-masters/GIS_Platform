import { Component, OnInit } from '@angular/core';
import {MenuItem} from "primeng/api";
import {NGXLogger} from "ngx-logger";

@Component({
  selector: 'crg-layer-objects',
  templateUrl: './layer-objects.component.html',
  styleUrls: ['./layer-objects.component.css']
})
export class LayerObjectsComponent implements OnInit {

  cols = [
    { field: 'vin', header: 'Vin' },
    { field: 'year', header: 'Year' },
    { field: 'brand', header: 'Brand' },
    { field: 'color', header: 'Color' }
  ];

  cars = [
    {
      vin: '1',
      year: '2018',
      brand: 'BMW',
      color: 'RED'
    },
    {
      vin: '2',
      year: '2018',
      brand: 'BMW',
      color: 'RED'
    },
    {
      vin: '3',
      year: '2018',
      brand: 'BMW',
      color: 'RED'
    },
    {
      vin: '4',
      year: '2018',
      brand: 'BMW',
      color: 'RED'
    },
    {
      vin: '5',
      year: '2018',
      brand: 'BMW',
      color: 'RED'
    },
    {
      vin: '6',
      year: '2018',
      brand: 'BMW',
      color: 'RED'
    },
    {
      vin: '7',
      year: '2018',
      brand: 'BMW',
      color: 'RED'
    },
    {
      vin: '8',
      year: '2018',
      brand: 'BMW',
      color: 'RED'
    },
    {
      vin: '9',
      year: '2018',
      brand: 'BMW',
      color: 'RED'
    },
    {
      vin: '10',
      year: '2018',
      brand: 'BMW',
      color: 'RED'
    },
    {
      vin: '11',
      year: '2018',
      brand: 'BMW',
      color: 'RED'
    },
    {
      vin: '12',
      year: '2018',
      brand: 'BMW',
      color: 'RED'
    },
    {
      vin: '13',
      year: '2018',
      brand: 'BMW',
      color: 'RED'
    },
    {
      vin: '14',
      year: '2018',
      brand: 'BMW',
      color: 'RED'
    },
  ];
  selectedItems: any;

  constructor(private logger: NGXLogger) {
    this.logger.info('LayerObjectsComponent constructor');
  }

  ngOnInit() {
  }

}
