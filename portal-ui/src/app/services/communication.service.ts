import {NGXLogger} from 'ngx-logger';
import {CrgLayer} from './geoserver/layers.service';
import {EventEmitter, Injectable, Output} from '@angular/core';
import {ValidationDialogData} from '../components/validation/validation-dialog/validation-dialog.component';
import {GmlDialogData} from '../components/export/export-dilog/export-dialog.component';

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

export interface SidebarData {
  action: ActionType;
  target: SidebarType;
}

export enum ActionType {
  OPEN,
  CLOSE,
  CLOSE_ALL,
  SWITCH
}

export enum SidebarType {
  INFO,       // Информационная панель
  LAYERS,     // Левая панель со слоями
  BUG_REPORT, // Панель отображения и редактирования ошибок
}
