import { EventEmitter, Output } from '@angular/core';

import { GmlDialogData } from '../components/export/export-dilog/export-dialog.component';
import { ValidationDialogData } from '../components/validation/validation-dialog/validation-dialog.component';
import { EditFeatureData } from '../components/edit-feature/edit-feature.component';
import { Sidebar } from './side-bar-manager.service';
import { CrgLayer } from '../services/crg/projects.models';

export interface ObjectDto {
  id: string;
  crgLayer: CrgLayer;
}

class CommunicationService {
  private static _instance: CommunicationService;

  @Output() sidebarManager = new EventEmitter<Sidebar>();
  @Output() validationDialog = new EventEmitter<ValidationDialogData>();
  @Output() selectedForValidation = new EventEmitter<CrgLayer[]>();
  @Output() gmlDialog = new EventEmitter<GmlDialogData>();
  @Output() editView = new EventEmitter<ObjectDto[]>();
  @Output() featuresUpdate$ = new EventEmitter<EditFeatureData>();

  static get instance() {
    return this._instance || (this._instance = new this());
  }
}

export const communicationService = CommunicationService.instance;
