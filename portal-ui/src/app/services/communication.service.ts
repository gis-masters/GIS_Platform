import { CrgProject, CrgVectorLayer } from './crg/projects.models';
import { Emitter } from './common/Emitter';

export interface ObjectDto {
  id: string;
  crgLayer: CrgVectorLayer;
}

class CommunicationService {
  private static _instance: CommunicationService;

  static get instance() {
    return this._instance || (this._instance = new this());
  }

  private constructor() {}

  validationInitiated = new Emitter<boolean>();
  needUpdateValidationResults = new Emitter<boolean>();
  mapInited = new Emitter<boolean>();
  authDialogOpen = new Emitter();
  authDialogSuccess = new Emitter();
  featuresUpdated = new Emitter();
  permissionsUpdated = new Emitter();
  datasetsUpdated = new Emitter();
  dataTablesUpdated = new Emitter();
  projectCreated = new Emitter<CrgProject>();
  projectsUpdated = new Emitter();
  allProjectsFetched = new Emitter();
  editBugObject = new Emitter<ObjectDto[]>();
  libraryItemsUpdated = new Emitter();
  beforeMapDestroy = new Emitter();
  logout = new Emitter();
  basemapsUpdated = new Emitter();
  drawOff = new Emitter();

  off(scope: unknown) {
    Emitter.scopeOff(scope);
  }
}

export const communicationService = CommunicationService.instance;
