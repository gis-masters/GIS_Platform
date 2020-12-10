import { getEnvironment } from '../../environment';
import { GeoUtil } from '../../util/GeoUtil';
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
import { currentUser } from '../../../stores/CurrentUser.store';
import { usersService } from '../../../services/crg/users.service';
import { http } from '../../http.service';

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

export async function fetchCurrentImport(importId: string) {
  currentImport.fit({ scratch: await getById(importId) });
  fillTasks();
}

export async function getById(id: string) {
  const url = `${await getImportUrl()}/${id}`;
  return (await http.get<InputStartResponseDto>(url)).import;
}

export async function checkImportStatus() {
  const { href } = currentImport.scratch;
  const { import: scratch } = await http.get<InputStartResponseDto>(href);
  currentImport.fit({ scratch });
  fillTasks();
}

async function getImportLayer(task: ImportTaskShort): Promise<ImportLayer> {
  return http.get<ImportLayer>(task.href + '/layer');
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
    const { import: scratchImport } = await http.post<InputStartResponseDto>(await getImportUrl(), payload);

    currentImport.fit({ scratch: scratchImport });

    await uploadTasks(scratchImport.href, file);

    return scratchImport;
  } catch (err) {
    currentImport.setError(err);

    return Promise.reject(err);
  }
}

async function getImportUrl(): Promise<string> {
  return (await serverProperties.geoServerUrl) + '/rest/imports';
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
  } catch (err) {
    currentImport.setError(err);
    return Promise.reject(err);
  }
}

/**
 * Последний шаг, после всех приготовлений, стартуем импорт.
 */
async function uploadToScratch() {
  // Geoserver "держит" этот запрос до самого конца импорта соответственно в зависимости от обьема ответ может
  // придти и через 10 минут... Наш gateway оборвет запрос через 10 сек, поэтому ошибку по таймауту 504 не считаем
  // ошибкой, ретраи здесь также не нужны.
  try {
    return await http.post(`${await getImportUrl()}/${currentImport.id}`, {});
  } catch (e) {
    if (!e.response || e.response.status !== 504) {
      currentImport.setError(e);
    }
  }
}

export async function fillTasks() {
  const tasks = currentImport.notFullfilledTasks;
  tasks.forEach(async task => currentImport.setFullTasks([await getFullImportTask(task)]));
}

export async function updateProgress() {
  const firstTask = currentImport.tasks[0];

  if (firstTask && firstTask.progress) {
    currentImport.setProgress(await http.get<ImportTaskProgress>(firstTask.progress));
  }
}

async function getFullImportTask(shortTask: ImportTaskShort): Promise<ImportTaskFull> {
  const { task } = await http.get<{ task: ImportTaskFull }>(shortTask.href);

  return task;
}

export async function deleteTask(task: ImportTaskShort) {
  await http.delete(task.href);
  await checkImportStatus();
}
