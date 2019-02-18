import {EventEmitter, Injectable, Output} from '@angular/core';
import {NGXLogger} from "ngx-logger";
import {ValidationDialogData} from "../components/validation/validation-dialog/validation-dialog.component";

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  @Output() layerObjectsSidebar = new EventEmitter<boolean>();
  @Output() bugReportSidebar = new EventEmitter<boolean>();

  @Output() validationDialog = new EventEmitter<ValidationDialogData>();
  @Output() selectedForValidation = new EventEmitter<string[]>();
  @Output() editView = new EventEmitter<ObjectDto[]>();

  @Output() gotoObject = new EventEmitter<ObjectDto>();

  constructor(private logger: NGXLogger) {

  }

  public layerObjectsSidebar$() {
    return this.layerObjectsSidebar;
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

  public editView$() {
    return this.editView;
  }
}

export interface ObjectDto {
  id: string;
  layerName: string;
}
