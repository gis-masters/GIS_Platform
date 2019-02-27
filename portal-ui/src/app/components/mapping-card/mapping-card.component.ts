import {NGXLogger} from 'ngx-logger';
import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {XsdFeature, SimpleProperty} from '../../services/gis/fgistp-rules.service';
import {ImportService, LayerItem, AS_IS_TYPE, NOT_IMPORT} from '../../services/geoserver/import.service';

@Component({
  selector: 'crg-mapping-card',
  templateUrl: './mapping-card.component.html',
  styleUrls: ['./mapping-card.component.css']
})
export class MappingCardComponent implements OnInit, OnChanges {

  @Input() layer: LayerItem;
  @Input() entityTypes: XsdFeature[];

  typeProperties: SimpleProperty[] = [];

  constructor(private logger: NGXLogger,
              private importService: ImportService) {
  }

  ngOnInit() {
    this.logger.info('Init: ', this.layer);

    this.typeProperties.push({name: NOT_IMPORT.name, title: NOT_IMPORT.title});
    this.typeProperties.push({name: AS_IS_TYPE.name, title: AS_IS_TYPE.title});
  }

  ngOnChanges(changes: SimpleChanges): void {
    // this.logger.info('--- ', changes['entityTypes'].currentValue);
  }

  tapeSelected(selected: string) {
    const selectedType = this.entityTypes.find((type: XsdFeature) => type.name === selected);

    this.importService.importFlow.setTable(this.layer.originalName, selectedType.tableName);
    this.typeProperties = [];
    this.typeProperties.push({name: NOT_IMPORT.name, title: NOT_IMPORT.title});
    this.typeProperties.push({name: AS_IS_TYPE.name, title: AS_IS_TYPE.title});

    selectedType.properties.forEach((property: SimpleProperty) => {
      this.typeProperties.push(property);
    });
  }

}
