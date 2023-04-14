import { CrgProject } from './gis/projects/projects.models';
import { CrgLayer, CrgVectorLayer } from './gis/layers/layers.models';
import { Dataset, VectorTable } from './data/vectorData/vectorData.models';
import { LibraryRecord } from './data/docLibrary/docLibrary.models';
import { Basemap } from './data/basemaps/basemaps.models';
import { WfsFeature } from './geoserver/wfs/wfs.models';
import { FileInfo } from './data/files/files.models';
import { Schema } from './data/schema/schema.models';
import { Emitter } from './common/Emitter';

export interface ObjectDto {
  id: string;
  crgLayer: CrgVectorLayer;
}

export interface DataChangeEventDetail<T> {
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
  authDialogSuccess = new Emitter();
  allProjectsFetched = new Emitter();
  editBugObject = new Emitter<ObjectDto[]>();
  beforeMapDestroy = new Emitter();
  drawOff = new Emitter();
  openAttributesBar = new Emitter<CrgVectorLayer>();

  basemapUpdated = new Emitter<DataChangeEventDetail<Basemap>>();
  datasetUpdated = new Emitter<DataChangeEventDetail<Dataset>>();
  featuresUpdated = new Emitter<DataChangeEventDetail<WfsFeature | null>>();
  fileConnectionsUpdated = new Emitter<DataChangeEventDetail<FileInfo[]>>();
  libraryRecordUpdated = new Emitter<DataChangeEventDetail<LibraryRecord>>();
  permissionsUpdated = new Emitter();
  projectUpdated = new Emitter<DataChangeEventDetail<CrgProject>>();
  schemaUpdated = new Emitter<DataChangeEventDetail<Schema>>();
  vectorTableUpdated = new Emitter<DataChangeEventDetail<VectorTable>>();
  layerUpdated = new Emitter<DataChangeEventDetail<CrgLayer>>();

  off(scope: unknown) {
    Emitter.scopeOff(scope);
  }
}

export const communicationService = CommunicationService.instance;
