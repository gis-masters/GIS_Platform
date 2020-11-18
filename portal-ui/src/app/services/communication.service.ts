import { EventEmitter } from '@angular/core';

import { GmlDialogData } from '../components/export/export-dilog/export-dialog.component';
import { ValidationDialogData } from '../components/validation/validation-dialog/validation-dialog.component';
import { CrgLayer, CrgProject } from '../services/crg/projects.models';
import { Emitter } from './util/Emitter';

export interface ObjectDto {
  id: string;
  crgLayer: CrgLayer;
}

class CommunicationService {
  private static _instance: CommunicationService;

  private constructor() {}

  featuresUpdated = new Emitter();
  permissionsUpdated = new Emitter();
  datasetsUpdated = new Emitter();
  projectCreated = new Emitter<CrgProject>();

  // TODO: избавиться от EventEmitter rxjs тут
  validationDialog = new EventEmitter<ValidationDialogData>();
  selectedForValidation = new EventEmitter<CrgLayer[]>();
  gmlDialog = new EventEmitter<GmlDialogData>();
  editView = new EventEmitter<ObjectDto[]>();

  off(scope: any) {
    Emitter.scopeOff(scope);
  }

  static get instance() {
    return this._instance || (this._instance = new this());
  }
}

export const communicationService = CommunicationService.instance;
