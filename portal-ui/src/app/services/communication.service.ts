import { CrgLayer, CrgProject } from './crg/projects.models';
import { Emitter } from './util/Emitter';

export interface ObjectDto {
  id: string;
  crgLayer: CrgLayer;
}

class CommunicationService {
  private static _instance: CommunicationService;

  static get instance() {
    return this._instance || (this._instance = new this());
  }

  private constructor() {}

  validationInitiated = new Emitter<boolean>();
  needUpdateValidationResults = new Emitter<boolean>();
  featuresUpdated = new Emitter();
  permissionsUpdated = new Emitter();
  datasetsUpdated = new Emitter();
  projectCreated = new Emitter<CrgProject>();
  editBugObject = new Emitter<ObjectDto[]>();

  off(scope: any) {
    Emitter.scopeOff(scope);
  }
}

export const communicationService = CommunicationService.instance;
