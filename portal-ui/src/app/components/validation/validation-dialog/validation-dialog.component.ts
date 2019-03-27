import {NGXLogger} from 'ngx-logger';
import {Component, Input} from '@angular/core';
import {StringUtil} from '../../../services/util/StringUtil';
import {MatListOption, MatSelectionList} from '@angular/material';
import {CrgLayer} from '../../../services/geoserver/layers.service';
import {CommunicationService} from '../../../services/communication.service';

@Component({
  selector: 'crg-validation-dialog',
  templateUrl: './validation-dialog.component.html',
  styleUrls: ['./validation-dialog.component.css']
})
export class ValidationDialogComponent {

  @Input() data: ValidationDialogData;

  filterTerm: string;
  selectedLayers: CrgLayer[] = [];

  constructor(private logger: NGXLogger,
              private communicationService: CommunicationService) {
  }

  onChange(selectionList: MatSelectionList) {
    this.selectedLayers = selectionList.selectedOptions.selected
      .map((selectedOption: MatListOption) => selectedOption.value);
  }

  initValidation() {
    this.communicationService.selectedForValidation.emit(this.selectedLayers);
  }

  handleTitle(crgLayer: CrgLayer) {
    return StringUtil.addGeometryTypeToTitle(crgLayer.title, crgLayer.name);
  }

}

export interface ValidationDialogData {
  layers: CrgLayer[];
}
