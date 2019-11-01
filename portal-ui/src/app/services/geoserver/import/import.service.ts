import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {forkJoin, Observable} from 'rxjs';

import { HttpQueue } from '../../util/HttpQueue';
import {GeoUtil} from '../../util/GeoUtil';
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
import {ImportDataHolderService} from "./import-data-holder.service";

@Injectable({
  providedIn: 'root'
})
export class ImportService {
  taskStatusesList: {[key: string]: string} = {
    PENDING: 'PENDING',
    READY: 'Подготовка',
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

  private importUrl: string;
  private JSON_FORMAT = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient,
              private httpq: HttpQueue,
              private importData: ImportDataHolderService,
              private localStorageService: LocalStorageService,
              private serverProp: ServerPropertiesService) {
      //TODO fixme
      this.serverProp.geoServerUrl.then((geoServerUrl) => {
        this.importUrl = geoServerUrl + '/rest/imports'
      });
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

    this.importData.file = file;
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
    return this.http.post(this.importUrl + '/' + this.importData.scratch_import.import.id, {});
  }

  getImportLayer(task: ImportTaskShort): Observable<ImportLayer> {
    return this.http.get<ImportLayer>(task.href + '/layer');
  }

  getAllImportLayers(): Observable<ImportLayer[]> {
    const observableTasks: Observable<ImportLayer>[] = [];
    this.importData.getScratchTasks()
        .forEach((task: TaskItem) => {
          observableTasks.push(this.getImportLayer(task));
        });

    return forkJoin(observableTasks);
  }

  async getFullImportTask(shortTask: ImportTaskShort): Promise<ImportTaskFull> {
    const { task } = await this.httpq.get<{task: ImportTaskFull}>(shortTask.href);
    return task;
  }

  getImportTaskProgress(task: ImportTaskFull): Promise<ImportTaskProgress> {
    return this.httpq.get<ImportTaskProgress>(task.progress);
  }

  checkImportStatus(url: string) {
    return this.http.get<InputStartResponseDto>(url);
  }

}
