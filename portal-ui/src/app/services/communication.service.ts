import { SnapEvent } from 'ol/events/SnapEvent';
import { DrawEvent } from 'ol/interaction/Draw';
import { ModifyEvent } from 'ol/interaction/Modify';

import { ObjectDto } from '../components/edit-bug-object/edit-bug-object.component';
import { Emitter } from './common/Emitter';
import { Basemap } from './data/basemaps/basemaps.models';
import { FileInfo } from './data/files/files.models';
import { Library, LibraryRecord } from './data/library/library.models';
import { Schema } from './data/schema/schema.models';
import { Task } from './data/task/task.models';
import { Dataset, VectorTable } from './data/vectorData/vectorData.models';
import { WfsFeature } from './geoserver/wfs/wfs.models';
import { CrgLayer, CrgVectorLayer } from './gis/layers/layers.models';
import { CrgProject } from './gis/projects/projects.models';

export interface DataChangeEventDetail<T> {
  type: 'create' | 'update' | 'delete';
  data: T;
}

export interface UtilityDialogCloseEventDetail {
  id: string;
  answer?: boolean;
  value?: string;
  formValue?: unknown;
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
  openAttributesBar = new Emitter<CrgVectorLayer>();
  minimizeAttributesBar = new Emitter();
  utilityDialogClosed = new Emitter<UtilityDialogCloseEventDetail>();

  drawEnd = new Emitter<DrawEvent>();
  modifyEnd = new Emitter<ModifyEvent>();
  snapDblClick = new Emitter<SnapEvent>();

  basemapUpdated = new Emitter<DataChangeEventDetail<Basemap>>();
  datasetUpdated = new Emitter<DataChangeEventDetail<Dataset>>();
  featuresUpdated = new Emitter<DataChangeEventDetail<WfsFeature | null>>();
  fileConnectionsUpdated = new Emitter<DataChangeEventDetail<FileInfo[]>>();
  libraryUpdated = new Emitter<DataChangeEventDetail<Library>>();
  libraryRecordUpdated = new Emitter<DataChangeEventDetail<LibraryRecord>>();
  permissionsUpdated = new Emitter();
  projectionUpdated = new Emitter();
  projectUpdated = new Emitter<DataChangeEventDetail<CrgProject>>();
  schemaUpdated = new Emitter<DataChangeEventDetail<Schema>>();
  vectorTableUpdated = new Emitter<DataChangeEventDetail<VectorTable>>();
  layerUpdated = new Emitter<DataChangeEventDetail<CrgLayer>>();
  taskUpdated = new Emitter<DataChangeEventDetail<Task>>();

  off(scope: unknown) {
    Emitter.scopeOff(scope);
  }
}

export const communicationService = CommunicationService.instance;
