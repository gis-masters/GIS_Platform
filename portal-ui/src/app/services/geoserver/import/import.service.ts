import {map} from 'rxjs/operators';
import {NGXLogger} from 'ngx-logger';
import {ImportFlow} from './importFlow';
import {Injectable} from '@angular/core';
import {forkJoin, Observable} from 'rxjs';
import {GeoUtil} from '../../util/GeoUtil';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {LocalStorageService} from '../../local-storage.service';
import {ServerPropertiesService} from '../../server-properties.service';
import {
  ImportLayer,
  ImportTask,
  ImportTaskFull,
  ImportTaskProgress,
  ImportTaskShort,
  InputStartResponseDto,
  TaskItem
} from './models';

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

  taskPendingCodes = [
    'PENDING',
    'READY',
    'RUNNING'
  ];

  importFlow = new ImportFlow();

  private importUrl = this.serverProp.geoServerUrl + '/rest/imports';
  private JSON_FORMAT = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient,
              private logger: NGXLogger,
              private localStorageService: LocalStorageService,
              private serverProp: ServerPropertiesService) {
    logger.info('ImportService start');
  }

  isTaskPending (task: ImportTaskFull | ImportTaskShort) {
    return this.taskPendingCodes.includes(task.state);
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
    const observableTasks: Observable<ImportLayer>[] = [];
    this.getTasks(isScratch)
        .forEach((task: TaskItem) => {
          observableTasks.push(this.getImportLayer(task));
        });

    return forkJoin(observableTasks);
  }

  getFullImportTask(task: ImportTaskShort): Observable<{task: ImportTaskFull}> {
    return this.http.get<{task: ImportTaskFull}>(task.href);
  }

  getImportTaskProgress(task: ImportTaskFull): Observable<ImportTaskProgress> {
    return this.http.get<ImportTaskProgress>(task.progress);
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
