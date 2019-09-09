import {NGXLogger} from 'ngx-logger';
import {Component, Input, ViewChild} from '@angular/core';
import {StringUtil} from '../../../services/util/StringUtil';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import {CrgLayer} from '../../../services/geoserver/layers.service';
import {CommunicationService} from '../../../services/communication.service';

@Component({
  selector: 'crg-validation-dialog',
  templateUrl: './validation-dialog.component.html',
  styleUrls: ['./validation-dialog.component.css']
})
export class ValidationDialogComponent {
  @ViewChild(MatSelectionList, { static: false }) layers: MatSelectionList;
  @Input() data: ValidationDialogData;

  filterTerm: string;
  selectedLayers: CrgLayer[] = [];

  selectAllLayers: boolean;
  selectText = 'Выделить всё';

  constructor(private logger: NGXLogger,
              private communicationService: CommunicationService) {
  }

  onChange(selectionList: MatSelectionList) {
    this.selectedLayers = selectionList.selectedOptions.selected
      .map((selectedOption: MatListOption) => selectedOption.value);
  }

  initValidation() {
    this.filterTerm = '';
    this.communicationService.validationDialog.emit({show: false, layers: null});

    this.communicationService.selectedForValidation.emit(this.selectedLayers);
    this.communicationService.stepperEvents.emit(4);
  }

  handleTitle(crgLayer: CrgLayer) {
    return StringUtil.addGeometryTypeToTitle(crgLayer.title, crgLayer.name);
  }

  selectAll() {
    if (!this.selectAllLayers) {
      this.layers.selectAll();
      this.selectAllLayers = true;
      this.selectText = 'Снять выделение';
    } else {
      this.layers.deselectAll();
      this.selectAllLayers = false;
      this.selectText = 'Выделить всё';
    }
  }
}

export interface ValidationDialogData {
  show: boolean;
  layers: CrgLayer[];
}
