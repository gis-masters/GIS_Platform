import {Component, Input, OnInit} from '@angular/core';
import {WfsService} from '../../services/geoserver/wfs.service';
import {ActionType, SideBarManager, SidebarType} from '../../services/side-bar-manager.service';
import {CrgLayer} from '../../services/geoserver/layers.service';

@Component({
  selector: 'crg-attributes-sidebar',
  templateUrl: './attributes-sidebar.component.html',
  styleUrls: ['./attributes-sidebar.component.css']
})
export class AttributesSidebarComponent implements OnInit {

  @Input() feature: CrgLayer;

  cars = [];

  selectedCars2: any;
  cols = [
    { field: 'vin', header: 'Vin' },
    { field: 'year', header: 'Year' },
    { field: 'brand', header: 'Brand' },
    { field: 'color', header: 'Color' }
  ];

  constructor(private sideBarManager: SideBarManager,
              private wfsService: WfsService) { }

  ngOnInit() {
    console.log('attr: ', this.feature);

    // this.openLayersService.getVisibleLayers();

    // this.wfsService.getFeatures('someFeature')
    //     .subscribe((fCollection: WfsFeatureCollection) => {
    //       console.log('fCollection: ', fCollection);
    //     });

    this.cars = [
      {
        'vin': '1',
        'year': 1990,
        'brand': 'Mercedes',
        'color': 'red'
      },
      {
        'vin': '3',
        'year': 1999,
        'brand': 'Opel',
        'color': 'red'
      },
      {
        'vin': '4',
        'year': 1995,
        'brand': 'Opel',
        'color': 'green'
      },
      {
        'vin': '5',
        'year': 2005,
        'brand': 'Mazda',
        'color': 'red'
      },
      {
        'vin': '6',
        'year': 2006,
        'brand': 'Mazda',
        'color': 'red'
      },
      {
        'vin': '7',
        'year': 2006,
        'brand': 'Mazda',
        'color': 'red'
      },
      {
        'vin': '8',
        'year': 2006,
        'brand': 'Mazda',
        'color': 'red'
      },
      {
        'vin': '9',
        'year': 2006,
        'brand': 'Mazda',
        'color': 'red'
      },
      {
        'vin': '10',
        'year': 2006,
        'brand': 'Mazda',
        'color': 'red'
      },
      {
        'vin': '11',
        'year': 2006,
        'brand': 'Mazda',
        'color': 'red'
      },
      {
        'vin': '12',
        'year': 2006,
        'brand': 'Mazda',
        'color': 'red'
      },
      {
        'vin': '2',
        'year': 2000,
        'brand': 'Mercedes',
        'color': 'black'
      }
    ];
  }

  closeMe() {
    this.sideBarManager.do({target: SidebarType.ATTRIBUTES, action: ActionType.CLOSE});
  }

  onRowSelect(event) {
    console.log('Selected: ', event.data);
  }

  onRowUnselect(event) {
    console.log('UnSelected: ', event.data);
  }
}
