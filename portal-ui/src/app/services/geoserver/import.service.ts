import {map} from 'rxjs/operators';
import {NGXLogger} from 'ngx-logger';
import {GeoUtil} from '../util/GeoUtil';
import {Injectable} from '@angular/core';
import {forkJoin, Observable} from 'rxjs';
import {BaseService} from '../base.service';
import {ColumnProjection} from "../gis/gis-db.service";
import {SimpleProperty} from "../gis/fgistp-rules.service";
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ServerPropertiesService} from '../server-properties.service';

@Injectable({
  providedIn: 'root'
})
export class ImportService {

  importFlow = new ImportFlow();

  private importUrl = this.serverProp.geoServerUrl + '/rest/imports';
  private JSON_FORMAT = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient,
              private logger: NGXLogger,
              private baseService: BaseService,
              private serverProp: ServerPropertiesService) {
    logger.info('ImportService start');
  }

  /**
   * Инициируем импорт во временное хранилище.
   */
  initScratchImport(): Observable<InputStartResponseDto | any> {
    const workspace = environment.scratchWorkspaceName;
    const storage = environment.scratchWorkspaceName + '_store';

    this.logger.info('Init import to: ', workspace, storage);

    const payload = {
      import: {
        targetWorkspace: {
          workspace: {
            name: workspace
          }
        }
      }
    };

    if (storage) {
      payload.import['targetStore'] = {
        dataStore: {
          name: storage
        }
      };
    }

    return this.http.post<InputStartResponseDto>(this.importUrl, payload, {headers: this.JSON_FORMAT});
  }

  addTask(url: string, file: File): Observable<any> {
    const tasksUrl = url + '/tasks';

    this.logger.info('Add task by url: ', tasksUrl, file.name);

    this.importFlow.file = file;
    const formData = new FormData();
    formData.append('name', file.name);
    formData.append('file', file);

    return this.http
               .post(tasksUrl, formData)
               .pipe(
                 map((tasks: ImportTask) => GeoUtil.tasksHandler(tasks))
               );
  }

  updateTaskMode(url: string, mode: string): Observable<any> {
    this.logger.info('Update task mode to: ', mode);

    const data = {
      task: {
        updateMode: mode
      }
    };

    return this.http.put(url, data, {headers: this.JSON_FORMAT});
  }

  updateTasksMode(tasks: ImportTasks, mode: string) {
    this.logger.info('Update ' + tasks.tasks.length + ' tasks');

    const observableTasks = [];
    tasks.tasks.forEach((task: ImportTaskShort) => {
      observableTasks.push(this.updateTaskMode(task.href, mode));
    });

    return forkJoin(observableTasks);
  }

  updateLayers(layers: ImportLayer[], tasks: TaskImport[]): Observable<any> {
    const observableTasks = [];
    layers.forEach((layer: ImportLayer) => {
      const data = this.prepareData(layer.layer, tasks);

      observableTasks.push(this.updateLayer(layer.layer.href, data));
    });

    return forkJoin(observableTasks);
  }

  updateLayer(url: string, data): Observable<any> {
    this.logger.info('Update layer to: ', data);

    return this.http.put(url, data);
  }

  /**
   * Последний шаг, после всех приготовлений, стартуем импорт.
   * @param importId -
   */
  startUpload(importId: number): Observable<any> {
    this.logger.info('Upload import: ', importId);

    return this.http.post(this.importUrl + '/' + importId, {});
  }

  startScratchUpload() {
    return this.startUpload(this.importFlow.scratch_import.import.id);
  }

  getImportLayer(task: ImportTaskShort): Observable<ImportLayer> {
    this.logger.info('Get layer: ', task);

    return this.http.get<ImportLayer>(task.href + '/layer');
  }

  getAllImportLayers(isScratch: boolean): Observable<ImportLayer[]> {
    this.logger.info('getAll import layers');

    const observableTasks = [];
    this.getTasks(isScratch)
        .forEach((task: TaskItem) => {
          observableTasks.push(this.getImportLayer(task));
        });

    return forkJoin(observableTasks);
  }

  checkImportStatus(url: string) {
    return this.http.get<InputStartResponseDto>(url);
  }

  private getTasks(isScratch: boolean) {
    let tasks = [];
    if (isScratch) {
      tasks = this.importFlow.scratch_import.import.tasks;
    } else {
      tasks = this.importFlow.work_import.target_import.import.tasks;
    }

    return tasks;
  }

  private prepareData(layer: LayerItem, tasks: TaskImport[]) {
    const workTableName = tasks.find((task: TaskImport) => task.layerName === layer.originalName).workTableName;

    return {
      layer: {
        name: 'fiz', // Scheme name from storage
        nativeName: workTableName
      }
    };
  }
}

export interface InputStartResponseDto {
  import: {
    id: 4,
    href: string,
    state: string,
    archive: boolean,
    targetWorkspace: {
      workspace: {
        name: string,
        isolated: boolean
      }
    },
    targetStore: {
      dataStore: {
        name: string,
        type: string
      }
    },
    tasks: ImportTaskShort[];
  };
}

export interface ImportTask {
  tasks?: ImportTaskShort[];
  task?: ImportTaskShort;
}

export interface ImportTasks {
  tasks: ImportTaskShort[];
}

export interface ImportTaskShort {
  id: number;
  href: string;
  state: string;
}

export interface TaskItem {
  id: number;
  href: string;
  progress: string;
  state: string;
  dataStore: any;
  updateMode: string;

  data: {
    type: string,
    format: string,
    file: string,
  };

  layer: {
    name: string,
    href: string,
  };

  target: {
    href: string,
  };

  transforms: any;
  transformChain: {
    type: string,
  };
}

export interface LayerItem {
  name: string;
  href: string;
  title: string;
  originalName: string;
  nativeName: string;
  srs: string;
  bbox: {
    minx: string,
    miny: string,
    maxx: string,
    maxy: string,
    crs: string
  };
  attributes: LayerAttribute[];
  style: {
    name: string,
    href: string
  };
}

export interface LayerAttribute {
  name: string;
  binding: string;
}

export interface ImportLayer {
  layer: LayerItem;
}

export class ImportFlow {
  scratch_import: InputStartResponseDto;
  work_import: WorkImport = new WorkImport();
  file: File;

  addTasks(tasks: ImportTasks, isScratch: boolean) {
    let target;
    if (isScratch) {
      target = this.scratch_import;
    } else {
      target = this.work_import.target_import;
    }

    target.import.tasks = [...tasks.tasks];
  }

  /**
   * Смена рабочей области обнуляем таблицу.
   * @param workspaceName Наименование рабочей области.
   */
  setWorkspace(workspaceName: string) {
    this.work_import.updateWorkspace(workspaceName);
  }

  setTable(layerName: string, newTableName: string) {
    this.work_import.updateTable(layerName, newTableName);
  }

}

export interface MappingItem {
  source: LayerAttribute;
  target: ColumnProjection;
}

export class TaskImport {
  // Наименование слоя из исходных данных
  layerName: string;

  // Таблица выбранная из рабочих даннх
  workTableName: string;

  // Список обьектов маппинга. (Что во что должно смапится)
  mapping: MappingItem[] = [];

  constructor(layerName: string) {
    this.layerName = layerName;
  }
}

export class WorkImport {
  // Наименование рабочей области
  workspace: string;
  dataStore: string;

  // Сюда ложим ответ от сервера при инициализации импорта
  target_import: InputStartResponseDto;

  // Задачи по модификациям данных.
  tasks: TaskImport[] = [];
  isWorkImportReady = false;

  addTask(layerName: string) {
    this.tasks.push(new TaskImport(layerName));

    this.updateWorkImportState();
  }

  addMapping(layerName: string, source: LayerAttribute, targetProperty: SimpleProperty) {
    const newMapping = {
      source: source,
      target: {
        name: targetProperty.name,
        type: targetProperty.name
      }
    };

    this.getTaskByLayerName(layerName)
        .mapping.push(newMapping);
  }

  updateMapping(layerName: string, source: LayerAttribute, property: SimpleProperty) {
    this.getTaskByLayerName(layerName).mapping
        .forEach((mapItem: MappingItem) => {
          if (mapItem.source.name === source.name) {
            mapItem.target = {
              name: property.name,
              type: property.name
            };
          }
        });
  }

  updateWorkspace(workspaceName: string) {
    this.workspace = workspaceName;
    this.tasks.forEach((task: TaskImport) => {
      task.mapping = [];
      task.workTableName = undefined;
    });

    this.updateWorkImportState();
  }

  updateTable(layerName: string, tableName: string) {
    const task = this.getTaskByLayerName(layerName);
    task.workTableName = tableName;
    task.mapping = [];

    this.updateWorkImportState();
  }

  getTaskByLayerName(layerName: string) {
    const foundTask = this.tasks.find((task: TaskImport) => task.layerName === layerName);

    if (!foundTask) {
      throw Error('Not found task by name: ' + layerName);
    }

    return foundTask;
  }

  clear() {
    this.workspace = undefined;
    this.tasks = [];
    this.target_import = undefined;
    this.updateWorkImportState();
  }

  updateWorkImportState() {
    if (this.workspace) {
      if (this.dataStore) {
        this.isWorkImportReady = !this.tasks.find((task: TaskImport) => !task.workTableName);
      } else {
        this.isWorkImportReady = false;
      }
    } else {
      this.isWorkImportReady = false;
    }
  }
}

export const AS_IS_TYPE = {
  title: 'Импортировать как есть',
  name: 'AsIs',
};

export const NOT_IMPORT = {
  title: 'Не импортировать',
  name: 'NotImport',
};
