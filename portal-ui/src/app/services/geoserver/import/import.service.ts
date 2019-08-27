import {map} from 'rxjs/operators';
import {NGXLogger} from 'ngx-logger';
import {ImportFlow} from './importFlow';
import {Injectable} from '@angular/core';
import {forkJoin, Observable} from 'rxjs';
import {GeoUtil} from '../../util/GeoUtil';
import {BaseService} from '../../base.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {LocalStorageService} from '../../local-storage.service';
import {ServerPropertiesService} from '../../server-properties.service';
import {NameHrefProjection} from '../projections';

@Injectable({
  providedIn: 'root'
})
export class ImportService {
  taskStatusesList: {[key: string]: string} = {
    PENDING: 'PENDING',
    READY: 'Готово',
    RUNNING: 'RUNNING',
    NO_CRS: 'Не определена проекция',
    NO_BOUNDS: 'NO_BOUNDS',
    NO_FORMAT: 'NO_FORMAT',
    BAD_FORMAT: 'BAD_FORMAT',
    ERROR: 'ERROR',
    CANCELED: 'CANCELED',
    COMPLETE: 'Завершен'
  };

  taskErrorCodes = [
    'NO_CRS',
    'NO_BOUNDS',
    'NO_FORMAT',
    'BAD_FORMAT',
    'ERROR',
    'CANCELED'
  ];

  importFlow = new ImportFlow();

  private importUrl = this.serverProp.geoServerUrl + '/rest/imports';
  private JSON_FORMAT = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient,
              private logger: NGXLogger,
              private baseService: BaseService,
              private localStorageService: LocalStorageService,
              private serverProp: ServerPropertiesService) {
    logger.info('ImportService start');
  }

  isTaskError (task: ImportTaskFull | ImportTaskShort) {
    return this.taskErrorCodes.includes(task.state);
  }

  /**
   * Инициируем импорт во временное хранилище.
   */
  initScratchImport(): Observable<InputStartResponseDto | any> {
    const orgId = this.localStorageService.getOrgId();
    const scratchWorkspace = 'scratch_database_' + orgId;

    const workspace = scratchWorkspace;
    const storage = scratchWorkspace + '_store';

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

  /**
   * Последний шаг, после всех приготовлений, стартуем импорт.
   */
  startScratchUpload() {
    return this.http.post(this.importUrl + '/' + this.importFlow.scratch_import.import.id, {});
  }

  getImportLayer(task: ImportTaskShort): Observable<ImportLayer> {
    return this.http.get<ImportLayer>(task.href + '/layer');
  }

  getAllImportLayers(isScratch: boolean): Observable<ImportLayer[]> {
    const observableTasks = [];
    this.getTasks(isScratch)
        .forEach((task: TaskItem) => {
          observableTasks.push(this.getImportLayer(task));
        });

    return forkJoin(observableTasks);
  }

  getFullImportTask(task: ImportTaskShort): Observable<ImportLayer> {
    return this.http.get<ImportLayer>(task.href);
  }

  getFullImportTasks(importTasks: ImportTaskShort[]): Observable<ImportTaskFull[]> {
    const observableTasks = [];
    importTasks.forEach((importTask: ImportTaskShort) => {
      observableTasks.push(this.getFullImportTask(importTask));
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

}

export interface InputStartResponseDto {
  import: {
    id: number,
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

export interface ImportTaskFull {
  id: number;
  href: string;
  state: string;
  layer: NameHrefProjection;
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

export interface ImportLayerItem {
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

  isActive?: boolean;
  isMapped?: boolean;
}

export interface LayerAttribute {
  name: string;
  binding: string;
}

export interface ImportLayer {
  layer: ImportLayerItem;
}

export const AS_IS_TYPE = {
  title: 'Импортировать как есть',
  name: 'AsIs',
};

export const NOT_IMPORT = {
  title: 'Не импортировать',
  name: 'NotImport',
};
