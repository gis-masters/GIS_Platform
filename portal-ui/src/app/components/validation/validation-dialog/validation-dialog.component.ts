import { Component, Input, ViewChild } from '@angular/core';
import { MatListOption, MatSelectionList } from '@angular/material/list';

import { addGeometryTypeToTitle } from '../../../services/util/stringUtil';
import { CrgLayer } from '../../../services/geoserver/layers.service';
import { CommunicationService } from '../../../services/communication.service';

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

  isAllSelected: boolean;

  constructor(private communicationService: CommunicationService) {
  }

  onChange() {
    this.isAllSelected = this.data.layers.length == this.layers.selectedOptions.selected.length;

    this.updateSelectedLayers();
  }

  initValidation() {
    this.filterTerm = '';
    this.communicationService.validationDialog.emit({show: false, layers: null});

    this.communicationService.selectedForValidation.emit(this.selectedLayers);
  }

  handleTitle(crgLayer: CrgLayer) {
    return addGeometryTypeToTitle(crgLayer.title, crgLayer.name);
  }

  selectAll() {
    if (this.isAllSelected) {
      this.layers.deselectAll();
    } else {
      this.layers.selectAll();
    }

    this.updateSelectedLayers();
  }

  private updateSelectedLayers() {
    this.selectedLayers = this.layers.selectedOptions.selected
        .map((selectedOption: MatListOption) => selectedOption.value);
  }
}

export interface ValidationDialogData {
  show: boolean;
  layers: CrgLayer[];
}
