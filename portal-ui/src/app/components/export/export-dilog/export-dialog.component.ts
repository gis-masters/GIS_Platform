import {NGXLogger} from 'ngx-logger';
import {Component, Input, ViewChild} from '@angular/core';
import {StringUtil} from '../../../services/util/StringUtil';
import {MatListOption, MatSelectionList} from '@angular/material';
import {CrgLayer} from '../../../services/geoserver/layers.service';
import {ValueTitleProjection} from '../../../services/geoserver/projections';
import {ExportGmlResponse, ExportService} from '../../../services/gis/export.service';
import {ActionType, CommunicationService, SidebarType} from '../../../services/communication.service';

@Component({
  selector: 'crg-export-dialog',
  templateUrl: './export-dialog.component.html',
  styleUrls: ['./export-dialog.component.css']
})
export class ExportDialogComponent {
  @ViewChild(MatSelectionList) list: MatSelectionList;
  @Input() layers: CrgLayer[];

  selectAllList: boolean;
  selectText = 'Выделить всё';

  filterTerm: string;
  selectedLayers: CrgLayer[] = [];
  selectedDocSchema: string = undefined;
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

  private isExportInited = false;

  constructor(private logger: NGXLogger,
              private communicationService: CommunicationService,
              private exportService: ExportService) {
  }

  onChange(selectionList: MatSelectionList) {
    this.selectedLayers = selectionList.selectedOptions.selected
      .map((selectedOption: MatListOption) => selectedOption.value);
  }

  initValidation() {
    this.isExportInited = true;

    this.exportService
        .exportGml(this.selectedLayers, this.selectedDocSchema)
        .subscribe((response: ExportGmlResponse) => {
          this.isExportInited = false;

          this.communicationService.stepperEvents.emit(5);
        });

    this.communicationService.sidebarManager.emit({action: ActionType.OPEN, target: SidebarType.INFO});
    this.communicationService.gmlDialog.emit({action: ActionType.CLOSE, layers: []});
  }

  handleTitle(crgLayer: CrgLayer) {
    return StringUtil.addGeometryTypeToTitle(crgLayer.title, crgLayer.name);
  }

  selectAll() {
    if (!this.selectAllList) {
      this.list.selectAll();
      this.selectAllList = true;
      this.selectText = 'Снять выделение';
    } else {
      this.list.deselectAll();
      this.selectAllList = false;
      this.selectText = 'Выделить всё';
    }
  }
}

export interface GmlDialogData {
  action: ActionType;
  layers: CrgLayer[];
}
