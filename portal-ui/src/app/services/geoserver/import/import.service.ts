import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';

import { HttpQueue } from '../../util/HttpQueue';
import { GeoUtil } from '../../util/GeoUtil';
import { localStorageService } from '../../local-storage.service';
import { serverProperties } from '../../server-properties.service';
import {
  ImportLayer,
  ImportTaskResponse,
  ImportTaskFull,
  ImportTaskProgress,
  ImportTaskShort,
  ScratchImport,
  InputStartResponseDto
} from './models';
import { currentImport } from '../../../stores/CurrentImport.store';

interface ImportRequestData {
  import: {
    targetWorkspace: {
      workspace: {
        name: string;
      };
    };
    targetStore?: {
      dataStore: {
        name: string;
      };
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class ImportService {
  private JSON_FORMAT = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient,
              private httpq: HttpQueue) { }

  async fetchCurrentImport (importId: string) {
    currentImport.fit({ scratch: await this.getById(importId) });
    this.fillTasks();
  }

  async getById (id: string) {
    const url = `${await this.getImportUrl()}/${id}`;
    return (await this.httpq.get<InputStartResponseDto>(url)).import;
  }

  async checkImportStatus() {
    const { href } = currentImport.scratch;
    const { import: scratch } = await this.httpq.get<InputStartResponseDto>(href);

    currentImport.fit({scratch});
    this.fillTasks();
  }

  getImportLayer(task: ImportTaskShort): Observable<ImportLayer> {
    return this.http.get<ImportLayer>(task.href + '/layer');
  }

  getAllImportLayers(): Observable<ImportLayer[]> {
    const observableTasks: Observable<ImportLayer>[] = [];

    currentImport.tasks.forEach((task) => {
      observableTasks.push(this.getImportLayer(task));
    });

    return forkJoin(observableTasks);
  }

  /**
   * Инициируем импорт во временное хранилище.
   */
  async initScratchImport(file: File): Promise<ScratchImport> {
    currentImport.reset({file});

    const orgId = localStorageService.getOrgId();
    const workspace = 'scratch_database_' + orgId;
    const storage = workspace + '_store';

    const payload: ImportRequestData = {
      import: {
        targetWorkspace: {
          workspace: {
            name: workspace
          }
        }
      }
    };

    if (storage) {
      payload.import.targetStore = {
        dataStore: {
          name: storage
        }
      };
    }

    try {
      const { import: scratchImport } = await this.httpq.post<InputStartResponseDto>(
          await this.getImportUrl(),
          payload,
          { headers: this.JSON_FORMAT }
      );

      currentImport.fit({scratch: scratchImport});

      await this.uploadTasks(scratchImport.href, file);

      return scratchImport;
    } catch (err) {
      currentImport.setError(err);

      return Promise.reject(err);
    }
  }

  private async getImportUrl (): Promise<string> {
    return (await serverProperties.geoServerUrl) + '/rest/imports';
  }

  private async uploadTasks(url: string, file: File) {
    const tasksUrl = url + '/tasks';

    const formData = new FormData();
    formData.append('name', file.name);
    formData.append('file', file);

    try {
      const tasks: ImportTaskShort[] = GeoUtil.tasksHandler(
                        await this.httpq.post<ImportTaskResponse>(tasksUrl, formData));

      this.fillTasks();

      if (tasks.length) {
        await this.uploadToScratch();
      }
    } catch (err) {
      currentImport.setError(err);
      return Promise.reject(err);
    }
  }

  /**
   * Последний шаг, после всех приготовлений, стартуем импорт.
   */
  private async uploadToScratch() {
    return this.httpq.post(`${await this.getImportUrl()}/${currentImport.id}`, {}).catch(err => {
      if (err.error.message !== 'Read timed out') {
        currentImport.setError(err);
      }
    });
  }

  async fillTasks () {
    const tasks = currentImport.notFullfilledTasks;
    tasks.forEach(async task => currentImport.setFullTasks([await this.getFullImportTask(task)]));
  }

  async updateProgress () {
    const firstTask = currentImport.tasks[0];

    if (firstTask && firstTask.progress) {
      currentImport.setProgress(await this.httpq.get<ImportTaskProgress>(firstTask.progress));
    }
  }

  private async getFullImportTask(shortTask: ImportTaskShort): Promise<ImportTaskFull> {
    const { task } = await this.httpq.get<{task: ImportTaskFull}>(shortTask.href);
    return task;
  }

  async deleteTask(task: ImportTaskShort) {
    await this.httpq.delete(task.href);
    await this.checkImportStatus();
  }
}
