import { IWorldOptions } from '@cucumber/cucumber/lib/support_code_library_builder/world';
import { setWorldConstructor, World } from '@wdio/cucumber-framework';

import { FileInfo } from '../../src/app/services/data/files/files.models';
import { LibraryRecord } from '../../src/app/services/data/library/library.models';
import { Schema } from '../../src/app/services/data/schema/schema.models';
import { Task } from '../../src/app/services/data/task/task.models';
import { Dataset, VectorTable } from '../../src/app/services/data/vectorData/vectorData.models';
import { NewWfsFeature } from '../../src/app/services/geoserver/wfs/wfs.models';
import { CrgLayer } from '../../src/app/services/gis/layers/layers.models';
import { CrgProject } from '../../src/app/services/gis/projects/projects.models';
import { FilterQuery } from '../../src/app/services/util/filters/filters.models';

export class ScenarioScope extends World {
  private _latestSchema?: Schema;
  private _latestDataset?: Dataset;
  private _latestProject?: CrgProject;
  private _latestProjectFolder?: CrgProject;
  private _latestFeatures?: NewWfsFeature[];
  private _latestFilter?: FilterQuery;
  private _latestLibraryRecords?: LibraryRecord[];
  private _latestFolder?: LibraryRecord;
  private _latestUploadedFile?: FileInfo;
  private _latestTask?: Task;
  private _latestUploadedFiles?: FileInfo[];
  private layers: CrgLayer[] = [];
  private vectorTables: VectorTable[] = [];

  constructor(parameters: IWorldOptions) {
    super(parameters);
  }

  findLayerByTitle(title: string): CrgLayer {
    const foundLayer = this.layers.find(l => l.title === title);

    return this.getEntityOrThrow<CrgLayer>(foundLayer, 'слой: ' + title);
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
    const latest = this.vectorTables.at(-1);

    return this.getEntityOrThrow<VectorTable>(latest, 'векторная таблица');
  }

  set latestVectorTable(vectorTable: VectorTable) {
    this.vectorTables.push(vectorTable);
  }

  get latestLayer(): CrgLayer {
    const latest = this.layers.at(-1);

    return this.getEntityOrThrow<CrgLayer>(latest, 'слой');
  }

  set latestLayer(layer: CrgLayer) {
    this.layers.push(layer);
  }

  get latestProject(): CrgProject {
    return this.getEntityOrThrow<CrgProject>(this._latestProject, 'проект');
  }

  set latestProject(project: CrgProject) {
    this._latestProject = project;
  }

  get latestProjectFolder(): CrgProject {
    return this.getEntityOrThrow<CrgProject>(this._latestProjectFolder, 'проект');
  }

  set latestProjectFolder(projectFolder: CrgProject) {
    this._latestProjectFolder = projectFolder;
  }

  get latestFilter(): FilterQuery {
    return this.getEntityOrThrow<FilterQuery>(this._latestFilter, 'фильтр');
  }

  set latestFilter(filter: FilterQuery) {
    this._latestFilter = filter;
  }

  get latestFolder(): LibraryRecord {
    return this.getEntityOrThrow<LibraryRecord>(this._latestFolder, 'папка');
  }

  set latestFolder(latestFolder: LibraryRecord) {
    this._latestFolder = latestFolder;
  }

  get latestLibraryRecords(): LibraryRecord[] {
    return this._latestLibraryRecords || [];
  }

  set latestLibraryRecords(records: LibraryRecord[]) {
    this._latestLibraryRecords = records;
  }

  get latestUploadedFile(): FileInfo {
    return this.getEntityOrThrow<FileInfo>(this._latestUploadedFile, 'файл');
  }

  set latestUploadedFile(file: FileInfo) {
    this._latestUploadedFile = file;
  }

  get latestTask(): Task {
    return this.getEntityOrThrow<Task>(this._latestTask, 'задача');
  }

  set latestTask(task: Task) {
    this._latestTask = task;
  }

  get latestUploadedFiles(): FileInfo[] {
    return this.getEntityOrThrow<FileInfo[]>(this._latestUploadedFiles, 'файлы');
  }

  set latestUploadedFiles(files: FileInfo[]) {
    this._latestUploadedFiles = files;
  }

  private getEntityOrThrow<T>(obj: T | undefined, entity: string): T {
    if (!obj) {
      throw new Error(`${entity} не инициализирован. Убедитесь что вызывали шаг создающий ${entity}`);
    }

    return obj;
  }
}

setWorldConstructor(ScenarioScope);
