import { AxiosError } from 'axios';

import { getEnvironment } from '../../environment';
import { GeoUtil } from '../../util/GeoUtil';
import {
  getGeoserverImportsUrl,
  getGeoserverImportTaskLayerUrl,
  getGeoserverImportTaskUrl,
  getGeoserverImportUrl,
  getGeoserverImportTaskProgressUrl,
  getApiImportUrl
} from '../../server-urls.service';
import {
  ImportLayer,
  ImportTaskResponse,
  ImportTaskFull,
  ImportTaskProgress,
  ImportTaskShort,
  ScratchImport,
  InputStartResponseDto
} from './import.models';
import { currentImport } from '../../../stores/CurrentImport.store';
import { currentUser } from '../../../stores/CurrentUser.store';
import { usersService } from '../../auth/users/users.service';
import { http } from '../../http.service';
import { TaskImport } from './taskImport';
import { Process } from '../../data/processes/processes.models';
import { wsService } from '../../ws.service';

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
  const url = await getApiImportUrl(projectId);
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
  const url = await getGeoserverImportUrl(id);
  const importStart = await http.get<InputStartResponseDto>(url);

  return importStart.import;
}

export async function checkImportStatus(): Promise<void> {
  const { import: scratch } = await http.get<InputStartResponseDto>(await getGeoserverImportUrl(currentImport.id), {
    cache: { disabled: true }
  });
  currentImport.fit({ scratch });
  fillTasks();
}

async function getImportLayer(task: ImportTaskShort): Promise<ImportLayer> {
  return http.get<ImportLayer>(await getGeoserverImportTaskLayerUrl(currentImport.id, task.id));
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

  const { scratchWorkspaceName } = await getEnvironment();
  const workspace = `${scratchWorkspaceName}_${currentUser.orgId}`;
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
    const { import: scratchImport } = await http.post<InputStartResponseDto>(await getGeoserverImportsUrl(), payload);

    currentImport.fit({ scratch: scratchImport });

    await uploadTasks(await getGeoserverImportUrl(scratchImport.id), file);

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
    return await http.post(`${await getGeoserverImportsUrl()}/${currentImport.id}`, {});
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

  if (firstTask && firstTask.progress) {
    currentImport.setProgress(
      await http.get<ImportTaskProgress>(await getGeoserverImportTaskProgressUrl(currentImport.id, firstTask.id), {
        cache: { disabled: true }
      })
    );
  }
}

async function getFullImportTask(shortTask: ImportTaskShort): Promise<ImportTaskFull> {
  const { task } = await http.get<{ task: ImportTaskFull }>(
    await getGeoserverImportTaskUrl(currentImport.id, shortTask.id)
  );

  return task;
}

export async function deleteTask(task: ImportTaskShort): Promise<void> {
  await http.delete(await getGeoserverImportTaskUrl(currentImport.id, task.id));
  await checkImportStatus();
}
