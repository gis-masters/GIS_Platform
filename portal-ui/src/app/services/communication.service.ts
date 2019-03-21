import {NGXLogger} from 'ngx-logger';
import {CrgLayer} from './geoserver/layers.service';
import {EventEmitter, Injectable, Output} from '@angular/core';
import {ValidationDialogData} from '../components/validation/validation-dialog/validation-dialog.component';
import {GmlDialogData} from '../components/export/export-dilog/export-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  @Output() infoSidebar = new EventEmitter<ActionType>();
  @Output() bugReportSidebar = new EventEmitter<ActionType>();
  @Output() layerObjectsSidebar = new EventEmitter<ActionType>();

  @Output() validationDialog = new EventEmitter<ValidationDialogData>();
  @Output() selectedForValidation = new EventEmitter<CrgLayer[]>();

  @Output() gmlDialog = new EventEmitter<GmlDialogData>();
  @Output() selectedForGml = new EventEmitter<CrgLayer[]>();

  @Output() editView = new EventEmitter<ObjectDto[]>();
  @Output() gotoObject = new EventEmitter<ObjectDto>();

  constructor(private logger: NGXLogger) {

  }

  public layerObjectsSidebar$() {
    return this.layerObjectsSidebar;
  }

  public infoSidebar$() {
    return this.infoSidebar;
  }

  public bugReportSidebar$() {
    return this.bugReportSidebar;
  }

  public gotoObject$() {
    return this.gotoObject;
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

export enum ActionType {
  OPEN,
  CLOSE,
  SWITCH
}
