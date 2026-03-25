import { type SnapEvent } from 'ol/events/SnapEvent';

import { type ObjectDto } from '../components/edit-bug-object/edit-bug-object.component';
import { Emitter } from './common/Emitter';
import { type Basemap } from './data/basemaps/basemaps.models';
import { type FileInfo } from './data/files/files.models';
import { type Library, type LibraryRecord } from './data/library/library.models';
import { type Schema } from './data/schema/schema.models';
import { type Task } from './data/task/task.models';
import { type Dataset, type VectorTable } from './data/vectorData/vectorData.models';
import { type WfsFeature } from './geoserver/wfs/wfs.models';
import { type CrgLayer, type CrgVectorLayer } from './gis/layers/layers.models';
import { type CrgProject } from './gis/projects/projects.models';

export interface DataChangeEventDetail<T> {
  type: 'create' | 'update' | 'delete';
  data: T;
}

export interface AnswerModalCloseEventDetail {
  id: string;
  answer?: boolean;
  value?: string;
  formValue?: unknown;
  /** Произвольные дополнительные данные (например, outputFormat для печати) */
  extra?: Record<string, unknown>;
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
  editBugObject = new Emitter<ObjectDto[]>();
  beforeMapDestroy = new Emitter();
  openAttributesBar = new Emitter<CrgVectorLayer>();
  minimizeAttributesBar = new Emitter();
  answerModalClosed = new Emitter<AnswerModalCloseEventDetail>();

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
