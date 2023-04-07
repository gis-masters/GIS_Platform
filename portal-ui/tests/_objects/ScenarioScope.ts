import { IWorldOptions } from '@cucumber/cucumber/lib/support_code_library_builder/world';
import { setWorldConstructor, World } from '@wdio/cucumber-framework';

import { Schema } from '../../src/app/services/data/schema/schema.models';
import { NewWfsFeature } from '../../src/app/services/geoserver/wfs/wfs.models';
import { Dataset, VectorTable } from '../../src/app/services/data/vectorData/vectorData.models';
import { CrgProject } from '../../src/app/services/gis/projects/projects.models';
import { CrgLayer } from '../../src/app/services/gis/layers/layers.models';
import { LibraryRecord } from '../../src/app/services/data/docLibrary/docLibrary.models';

export class ScenarioScope extends World {
  private _latestSchema?: Schema;
  private _latestDataset?: Dataset;
  private _latestVectorTable?: VectorTable;
  private _latestProject?: CrgProject;
  private _latestLayer?: CrgLayer;
  private _latestFeatures?: NewWfsFeature[];
  private _latestLibraryRecords?: LibraryRecord[];

  constructor(parameters: IWorldOptions) {
    super(parameters);
  }

  get latestFeatures(): NewWfsFeature[] {
    return this.getEntityOrThrow<NewWfsFeature[]>(this._latestFeatures, 'фичи слоя');
  }

  set latestFeatures(value: NewWfsFeature[]) {
    this._latestFeatures = value;
  }

  get latestSchema(): Schema {
    return this.getEntityOrThrow<Schema>(this._latestSchema, 'схема данных');
  }

  set latestSchema(schema: Schema) {
    this._latestSchema = schema;
  }

  get latestDataset(): Dataset {
    return this.getEntityOrThrow<Dataset>(this._latestDataset, 'набор данных');
  }

  set latestDataset(dataset: Dataset) {
    this._latestDataset = dataset;
  }

  get latestVectorTable(): VectorTable {
    return this.getEntityOrThrow<VectorTable>(this._latestVectorTable, 'векторная таблица');
  }

  set latestVectorTable(vectorTable: VectorTable) {
    this._latestVectorTable = vectorTable;
  }

  get latestProject(): CrgProject {
    return this.getEntityOrThrow<CrgProject>(this._latestProject, 'проект');
  }

  set latestProject(project: CrgProject) {
    this._latestProject = project;
  }

  get latestLayer(): CrgLayer {
    return this.getEntityOrThrow<CrgLayer>(this._latestLayer, 'слой');
  }

  set latestLayer(layer: CrgLayer) {
    this._latestLayer = layer;
  }

  get latestLibraryRecords(): LibraryRecord[] {
    return this._latestLibraryRecords || [];
  }

  set latestLibraryRecords(records: LibraryRecord[]) {
    this._latestLibraryRecords = records;
  }

  private getEntityOrThrow<T>(obj: T | undefined, entity: string): T {
    if (!obj) {
      throw new Error(`${entity} не инициализирован. Убедитесь что вызывали шаг создающий ${entity}`);
    }

    return obj;
  }
}

setWorldConstructor(ScenarioScope);
