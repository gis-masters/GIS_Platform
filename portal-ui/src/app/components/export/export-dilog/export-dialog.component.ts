import { Component, OnDestroy, ViewChild } from '@angular/core';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { NGXLogger } from 'ngx-logger';
import { Subject } from 'rxjs';

import { addGeometryTypeToTitle } from '../../../services/util/stringUtil';
import { communicationService } from '../../../services/communication.service';
import { exportService } from '../../../services/crg/export.service';
import { sidebars } from '../../../stores/Sidebars.store';
import { Process } from '../../../services/crg/models';
import { CrgLayer } from '../../../services/crg/projects.models';
import { currentProject } from '../../../stores/CurrentProject.store';

export interface GmlDialogData {
  action: ActionType;
  layers: CrgLayer[];
}

export enum ActionType {
  OPEN,
  CLOSE,
  SWITCH
}


@Component({
  selector: 'crg-export-dialog',
  templateUrl: './export-dialog.component.html',
  styleUrls: ['./export-dialog.component.css']
})
export class ExportDialogComponent implements OnDestroy {
  @ViewChild(MatSelectionList) list: MatSelectionList;

  layers: CrgLayer[];

  isAllSelected: boolean;

  filterTerm: string;
  selectedLayers: CrgLayer[] = [];
  selectedDocSchema: string = undefined;
  docs = [
    {
      value: 'Doc.10501010100',
      title: 'Положение о территориальном планировании в области федерального транспорта'
    },
    {
      value: 'Doc.10502010100',
      title:
        'Положение о территориальном планировании в области федерального транспорта (в части трубопроводного транспорта)'
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
    }
  ];

  private isExportInited = false;
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private logger: NGXLogger) {
    this.layers = currentProject.vectorLayers;
  }

  onChange(selectionList: MatSelectionList) {
    this.isAllSelected = this.layers.length == this.list.selectedOptions.selected.length;

    this.updateSelectedLayers();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  async initValidation() {
    this.isExportInited = true;

    const layerNames = this.selectedLayers.map((crgLayer: CrgLayer) => crgLayer.internalName);
    const process: Process = await exportService.export({
      layers: layerNames,
      docSchema: this.selectedDocSchema
    });
    // TODO: Ответ пойдет по вебсокету, но здесь его нужно подстраховать
    this.logger.info('export to GML response', process);
    this.isExportInited = false;

    sidebars.openInfo();
    communicationService.gmlDialog.emit({ action: ActionType.CLOSE, layers: [] });
  }

  handleTitle(crgLayer: CrgLayer) {
    return addGeometryTypeToTitle(crgLayer.title, crgLayer.internalName);
  }

  selectAll() {
    if (this.isAllSelected) {
      this.list.deselectAll();
    } else {
      this.list.selectAll();
    }

    this.updateSelectedLayers();
  }

  private updateSelectedLayers() {
    this.selectedLayers = this.list.selectedOptions.selected.map(
      (selectedOption: MatListOption) => selectedOption.value
    );
  }
}
