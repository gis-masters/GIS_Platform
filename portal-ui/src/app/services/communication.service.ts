import {NGXLogger} from 'ngx-logger';
import {CrgLayer} from './geoserver/layers.service';
import {SidebarData} from './side-bar-manager.service';
import {EventEmitter, Injectable, Output} from '@angular/core';
import {GmlDialogData} from '../components/export/export-dilog/export-dialog.component';
import {ValidationDialogData} from '../components/validation/validation-dialog/validation-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  @Output() sidebarManager = new EventEmitter<SidebarData>();

  @Output() validationDialog = new EventEmitter<ValidationDialogData>();
  @Output() selectedForValidation = new EventEmitter<CrgLayer[]>();

  @Output() gmlDialog = new EventEmitter<GmlDialogData>();
  @Output() selectedForGml = new EventEmitter<CrgLayer[]>();

  @Output() editView = new EventEmitter<ObjectDto[]>();

  @Output() stepperEvents = new EventEmitter<number>();

  constructor(private logger: NGXLogger) {

  }

  public stepperEvents$() {
    return this.stepperEvents;
  }

  public sidebarManager$() {
    return this.sidebarManager;
  }

  public validationDialog$() {
    return this.validationDialog;
  }

  public selectedForValidationLayers$() {
    return this.selectedForValidation;
  }

  public gmlDialog$() {
    return this.gmlDialog;
  }

  public selectedForGmlLayers$() {
    return this.selectedForGml;
  }

  public editView$() {
    return this.editView;
  }
}

export interface ObjectDto {
  id: string;
  crgLayer: CrgLayer;
}
