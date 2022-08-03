import { CrgProject, CrgVectorLayer } from './gis/projects.models';
import { Emitter } from './common/Emitter';
import { FileInfo } from './data/files.service';

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
  authDialogOpen = new Emitter();
  authDialogSuccess = new Emitter();
  featuresUpdated = new Emitter();
  permissionsUpdated = new Emitter();
  datasetsUpdated = new Emitter();
  vectorTablesUpdated = new Emitter();
  projectCreated = new Emitter<CrgProject>();
  projectsUpdated = new Emitter();
  allProjectsFetched = new Emitter();
  editBugObject = new Emitter<ObjectDto[]>();
  libraryItemsUpdated = new Emitter();
  beforeMapDestroy = new Emitter();
  logout = new Emitter();
  basemapsUpdated = new Emitter();
  drawOff = new Emitter();
  fileConnectionsUpdated = new Emitter<FileInfo[]>();
  openAttributesBar = new Emitter<CrgVectorLayer>();

  off(scope: unknown) {
    Emitter.scopeOff(scope);
  }
}

export const communicationService = CommunicationService.instance;
