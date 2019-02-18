import {NGXLogger} from "ngx-logger";
import {Component, Input} from '@angular/core';
import {MatListOption, MatSelectionList} from "@angular/material";
import {NameHrefProjection} from "../../../services/geoserver/projections";
import {CommunicationService} from "../../../services/communication.service";
import {CrgLayer} from "../../../services/geoserver/layers.service";

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
    this.selectedLayers = [];
    selectionList.selectedOptions.selected
      .map((selectedOption: MatListOption) => {
        let title = selectedOption.getLabel();
        this.selectedLayers.push(this.data.layers.find(value => value.title === title));
      });
  }

  initValidation() {
    this.logger.info('??????????????? ', this.selectedLayers);
    this.communicationService.selectedForValidation.emit(this.selectedLayers);
  }

}

export interface ValidationDialogData {
  layers: CrgLayer[];
}
