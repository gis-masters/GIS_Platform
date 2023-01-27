import { CrgProject, CrgVectorLayer } from './gis/projects.models';
import { LibraryRecord } from './data/doc-library.service';
import { Dataset, VectorTable } from './data/data.service';
import { WfsFeature } from './geoserver/wfs.models';
import { Basemap } from './data/basemaps.models';
import { FileInfo } from './data/files.service';
import { Schema } from './data/schema.models';
import { Emitter } from './common/Emitter';

export interface ObjectDto {
  id: string;
  crgLayer: CrgVectorLayer;
}

export interface DataChangeEvent<T> {
  type: 'create' | 'update' | 'delete';
  data: T;
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
  allProjectsFetched = new Emitter();
  editBugObject = new Emitter<ObjectDto[]>();
  beforeMapDestroy = new Emitter();
  drawOff = new Emitter();
  openAttributesBar = new Emitter<CrgVectorLayer>();

  basemapUpdated = new Emitter<DataChangeEvent<Basemap>>();
  datasetUpdated = new Emitter<DataChangeEvent<Dataset>>();
  featuresUpdated = new Emitter<DataChangeEvent<WfsFeature | null>>();
  fileConnectionsUpdated = new Emitter<DataChangeEvent<FileInfo[]>>();
  libraryRecordUpdated = new Emitter<DataChangeEvent<LibraryRecord>>();
  permissionsUpdated = new Emitter();
  projectUpdated = new Emitter<DataChangeEvent<CrgProject>>();
  schemaUpdated = new Emitter<DataChangeEvent<Schema>>();
  vectorTableUpdated = new Emitter<DataChangeEvent<VectorTable>>();

  off(scope: unknown) {
    Emitter.scopeOff(scope);
  }
}

export const communicationService = CommunicationService.instance;
