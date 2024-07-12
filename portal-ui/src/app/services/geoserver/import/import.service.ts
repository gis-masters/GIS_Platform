import { AxiosError } from 'axios';

import { currentImport } from '../../../stores/CurrentImport.store';
import { currentUser } from '../../../stores/CurrentUser.store';
import { http } from '../../api/http.service';
import { getApiImportUrl } from '../../api/server-urls.service';
import { usersService } from '../../auth/users/users.service';
import { Process } from '../../data/processes/processes.models';
import { environment } from '../../environment';
import { GeoUtil } from '../../util/GeoUtil';
import { wsService } from '../../ws.service';
import { importClient } from './import.client';
import {
  ImportLayer,
  ImportRequestData,
  ImportTaskFull,
  ImportTaskResponse,
  ImportTaskShort,
  InputStartResponseDto,
  ScratchImport
} from './import.models';
import { TaskImport } from './taskImport';

const importNotInited = 'Импорт не инициализирован';

/**
 * Для выполнения импорта передаем на бекенд geoserverName(то имя под которым создан workspace на геосервере,
 * то имя под которым создана схема в БД) проекта в который хотим импортировать.
 * Организация, а соответственно и название БД есть на сервере.
 */
export async function doWorkImport(
  importTasks: TaskImport[],
  projectId: number,
  targetSchema: string
): Promise<Process> {
  const url = getApiImportUrl(projectId);
  const payload = {
    wsUiId: wsService.getId(),
    targetSchema,
    importTasks
  };

  return http.post<Process>(url, payload);
}

export async function fetchCurrentImport(importId: string): Promise<void> {
  currentImport.fit({ scratch: await getById(importId) });

  fillTasks();
}

export async function getById(id: string): Promise<ScratchImport> {
  const importStart = await importClient.getImport(id);

  return importStart.import;
}

export async function checkImportStatus(): Promise<void> {
  if (!currentImport.id) {
    throw new Error(importNotInited);
  }

  const { import: scratch } = await importClient.getImportWithoutCache(currentImport.id);
  currentImport.fit({ scratch });

  fillTasks();
}

async function getImportLayer(task: ImportTaskShort): Promise<ImportLayer> {
  if (!currentImport.id) {
    throw new Error(importNotInited);
  }

  return await importClient.getTaskLayer(currentImport.id, task.id);
}

export async function getAllImportLayers(): Promise<ImportLayer[]> {
  return Promise.all(currentImport.tasks.map(getImportLayer));
}

/**
 * Инициируем импорт во временное хранилище.
 */
export async function initScratchImport(file: File): Promise<ScratchImport> {
  currentImport.reset({ file });
  await usersService.fetchCurrentUser();

  const workspace = `${environment.scratchWorkspaceName}_${currentUser.orgId}`;
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
    const { import: scratchImport } = await http.post<InputStartResponseDto>(
      importClient.getGeoserverImportsUrl(),
      payload
    );

    currentImport.fit({ scratch: scratchImport });

    await uploadTasks(importClient.getGeoserverImportUrl(scratchImport.id), file);

    return scratchImport;
  } catch (error) {
    currentImport.setError();
    throw error;
  }
}

async function uploadTasks(url: string, file: File) {
  const tasksUrl = url + '/tasks';

  const formData = new FormData();
  formData.append('name', file.name);
  formData.append('file', file);

  try {
    const tasks: ImportTaskShort[] = GeoUtil.tasksHandler(await http.post<ImportTaskResponse>(tasksUrl, formData));

    fillTasks();

    if (tasks.length) {
      await uploadToScratch();
    }
  } catch (error) {
    currentImport.setError();
    throw error;
  }
}

/**
 * Последний шаг, после всех приготовлений, стартуем импорт.
 */
async function uploadToScratch() {
  // Geoserver "держит" этот запрос до самого конца импорта соответственно в зависимости от объема ответ может
  // придти и через 10 минут... Наш gateway оборвет запрос через 10 сек, поэтому ошибку по таймауту 504 не считаем
  // ошибкой, повторы здесь также не нужны.
  try {
    return await http.post(`${importClient.getGeoserverImportsUrl()}/${currentImport.id}`, {});
  } catch (error) {
    if ((error as AxiosError).response?.status !== 504) {
      currentImport.setError();
    }
  }
}

export function fillTasks(): void {
  const tasks = currentImport.notFulfilledTasks;
  tasks.forEach(async task => currentImport.setFullTasks([await getFullImportTask(task)]));
}

export async function updateProgress(): Promise<void> {
  const firstTask = currentImport.tasks[0];

  if (firstTask && firstTask.progress && currentImport.id) {
    currentImport.setProgress(await importClient.getImportTaskProgress(currentImport.id, firstTask.id));
  }
}

async function getFullImportTask(shortTask: ImportTaskShort): Promise<ImportTaskFull> {
  if (!currentImport.id) {
    throw new Error(importNotInited);
  }

  const { task } = await importClient.getTask(currentImport.id, shortTask.id);

  return task;
}

export async function deleteTask(task: ImportTaskShort): Promise<void> {
  if (!currentImport.id) {
    throw new Error(importNotInited);
  }

  await importClient.deleteTask(currentImport.id, task.id);

  await checkImportStatus();
}
