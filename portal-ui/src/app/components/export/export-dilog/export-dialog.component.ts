import {NGXLogger} from 'ngx-logger';
import {Component, Input, OnDestroy, ViewChild} from '@angular/core';
import {StringUtil} from '../../../services/util/StringUtil';
import {MatListOption, MatSelectionList} from '@angular/material';
import {CrgLayer} from '../../../services/geoserver/layers.service';
import {ValueTitleProjection} from '../../../services/geoserver/projections';
import {CommunicationService} from '../../../services/communication.service';
import {ExportGmlResponse, ExportService} from '../../../services/crg/export.service';
import {ActionType, SideBarManager, SidebarType} from '../../../services/side-bar-manager.service';
import {ProcessResponse} from '../../../services/models/requestModel';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'crg-export-dialog',
  templateUrl: './export-dialog.component.html'
})
export class ExportDialogComponent implements OnDestroy {
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
  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private logger: NGXLogger,
              private sideBarManager: SideBarManager,
              private communicationService: CommunicationService,
              private exportService: ExportService) {
  }

  onChange(selectionList: MatSelectionList) {
    this.selectedLayers = selectionList.selectedOptions.selected
        .map((selectedOption: MatListOption) => selectedOption.value);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  initValidation() {
    this.isExportInited = true;

    const layerNames = this.selectedLayers.map((crgLayer: CrgLayer) => crgLayer.name);
    this.exportService
        .export({layers: layerNames, docSchema: this.selectedDocSchema})
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((process: ProcessResponse) => {
          // TODO: Ответ пойдет по вебсокету, но здесь его нужно подстраховать
          this.logger.info('export to GML response', process);
          this.isExportInited = false;

          this.communicationService.stepperEvents.emit(5);
        });

    this.sideBarManager.do({target: SidebarType.INFO, action: ActionType.OPEN});
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
