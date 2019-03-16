import {NGXLogger} from 'ngx-logger';
import {Component, Input} from '@angular/core';
import {MatListOption, MatSelectionList} from '@angular/material';
import {CrgLayer} from '../../../services/geoserver/layers.service';
import {ExportGmlResponse, ExportService} from '../../../services/gis/export.service';
import {ValueTitleProjection} from "../../../services/geoserver/projections";

@Component({
  selector: 'crg-export-dialog',
  templateUrl: './export-dialog.component.html',
  styleUrls: ['./export-dialog.component.css']
})
export class ExportDialogComponent {

  @Input() layers: CrgLayer[];

  filterTerm: string;
  selectedLayers: CrgLayer[] = [];
  selectedDocSchema: string = undefined;

  private isExportInited = false;
  docs: ValueTitleProjection[] = [
    {
      value: 'Doc.10501010100',
      title: 'Положение о территориальном планировании в области федерального транспорта'
    },
    {
      value: 'Doc.10502010100',
      title: 'Положение о территориальном планировании в области федерального транспорта (в части трубопроводного транспорта)'
    },
    {
      value: 'Doc.10504010100',
      title: 'Положение о территориальном планировании в области энергетики'
    },
    {
      value: 'Doc.10505010100',
      title: 'Положение о территориальном планировании в области высшего образования'
    },
    {
      value: 'Doc.10506010100',
      title: 'Положение о территориальном планировании в области здравоохранения'
    },
    {
      value: 'Doc.10803010100',
      title: 'Положение о территориальном планировании субъекта Российской Федерации'
    },
    {
      value: 'Doc.20101010000',
      title: 'Положение о территориальном планировании муниципального района'
    },
    {
      value: 'Doc.20201010000',
      title: 'Положение о территориальном планировании поселения'
    },
    {
      value: 'Doc.20301010000',
      title: 'Положение о территориальном планировании городского округа'
    },
  ];

  constructor(private logger: NGXLogger,
              private exportService: ExportService) {
  }

  onChange(selectionList: MatSelectionList) {
    this.selectedLayers = [];
    selectionList.selectedOptions.selected
      .map((selectedOption: MatListOption) => {
        const title = selectedOption.getLabel();
        const items = this.layers.find(value => value.title.trim().toLowerCase() === title.trim().toLowerCase());

        this.selectedLayers.push(items);
      });
  }

  initValidation() {
    this.isExportInited = true;

    this.exportService
        .exportGml(this.selectedLayers, this.selectedDocSchema)
        .subscribe((response: ExportGmlResponse) => {
          this.isExportInited = false;

          this.logger.info(' * * * exportGml response * * *', response);
        });
  }

}
