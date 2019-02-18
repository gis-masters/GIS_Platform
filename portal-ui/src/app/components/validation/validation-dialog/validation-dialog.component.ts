import {NGXLogger} from "ngx-logger";
import {Component, Input} from '@angular/core';
import {MatListOption, MatSelectionList} from "@angular/material";
import {NameHrefProjection} from "../../../services/geoserver/projections";
import {CommunicationService} from "../../../services/communication.service";

@Component({
  selector: 'crg-validation-dialog',
  templateUrl: './validation-dialog.component.html',
  styleUrls: ['./validation-dialog.component.css']
})
export class ValidationDialogComponent {

  @Input() data: ValidationDialogData;

  filterTerm: string;
  nameOfSelectedLayers = [];

  constructor(private logger: NGXLogger,
              private communicationService: CommunicationService) {
  }

  onChange(selectionList: MatSelectionList) {
    this.nameOfSelectedLayers = selectionList.selectedOptions.selected
      .map((selectedOption: MatListOption) => selectedOption.getLabel());
  }

  initValidation() {
    this.communicationService.selectedForValidation.emit(this.nameOfSelectedLayers);
  }

}

export interface ValidationDialogData {
  layers: NameHrefProjection[];
}
