import { HttpHeaders } from '@angular/common/http';

import { GeoUtil } from '../../util/GeoUtil';
import { localStorageService } from '../../local-storage.service';
import { serverProperties } from '../../server-properties.service';
import { services } from '../../services';
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

const JSON_FORMAT = new HttpHeaders({ 'Content-Type': 'application/json' });

export const fetchCurrentImport = async (importId: string) => {
  currentImport.fit({ scratch: await getById(importId) });
  fillTasks();
};

export const getById = async (id: string) => {
  await services.provided;
  const url = `${await getImportUrl()}/${id}`;
  return (await services.httpq.get<InputStartResponseDto>(url)).import;
};

export const checkImportStatus = async () => {
  await services.provided;
  const { href } = currentImport.scratch;
  const { import: scratch } = await services.httpq.get<InputStartResponseDto>(href);

  currentImport.fit({ scratch });
  fillTasks();
};

const getImportLayer = async (task: ImportTaskShort): Promise<ImportLayer> => {
  await services.provided;

  return services.httpq.get<ImportLayer>(task.href + '/layer');
};

export const getAllImportLayers = (): Promise<ImportLayer[]> => {
  return Promise.all(currentImport.tasks.map(getImportLayer));
};

/**
 * Инициируем импорт во временное хранилище.
 */
export const initScratchImport = async (file: File): Promise<ScratchImport> => {
  await services.provided;
  currentImport.reset({ file });

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
    const { import: scratchImport } = await services.httpq.post<InputStartResponseDto>(
      await getImportUrl(),
      payload,
      { headers: JSON_FORMAT }
    );

    currentImport.fit({ scratch: scratchImport });

    await uploadTasks(scratchImport.href, file);

    return scratchImport;
  } catch (err) {
    currentImport.setError(err);

    return Promise.reject(err);
  }
};

const getImportUrl = async (): Promise<string> => {
  return (await serverProperties.geoServerUrl) + '/rest/imports';
};

const uploadTasks = async (url: string, file: File) => {
  await services.provided;
  const tasksUrl = url + '/tasks';

  const formData = new FormData();
  formData.append('name', file.name);
  formData.append('file', file);

  try {
    const tasks: ImportTaskShort[] = GeoUtil.tasksHandler(
      await services.httpq.post<ImportTaskResponse>(tasksUrl, formData));

    fillTasks();

    if (tasks.length) {
      await uploadToScratch();
    }
  } catch (err) {
    currentImport.setError(err);
    return Promise.reject(err);
  }
};

/**
 * Последний шаг, после всех приготовлений, стартуем импорт.
 */
const uploadToScratch = async () => {
  return services.httpq.post(`${await getImportUrl()}/${currentImport.id}`, {}).catch(err => {
    // Geoserver "держит" этот запрос до самого конца импорта соответственно в зависимости от обьема ответ может
    // придти и через 10 минут... Наш gateway оборвет запрос через 10 сек, поэтому ошибку по таймауту 504 не считаем
    // ошибкой, ретраи здесь также не нужны.
    if (err && err.status !== 504) {
      currentImport.setError(err);
    }
  });
};

export const fillTasks = async () => {
  const tasks = currentImport.notFullfilledTasks;
  tasks.forEach(async task => currentImport.setFullTasks([ await getFullImportTask(task) ]));
};

export const updateProgress = async () => {
  await services.provided;
  const firstTask = currentImport.tasks[ 0 ];

  if (firstTask && firstTask.progress) {
    currentImport.setProgress(await services.httpq.get<ImportTaskProgress>(firstTask.progress));
  }
};

const getFullImportTask = async (shortTask: ImportTaskShort): Promise<ImportTaskFull> => {
  await services.provided;
  const { task } = await services.httpq.get<{ task: ImportTaskFull }>(shortTask.href);
  return task;
};

export const deleteTask = async (task: ImportTaskShort) => {
  await services.provided;
  await services.httpq.delete(task.href);
  await checkImportStatus();
};
