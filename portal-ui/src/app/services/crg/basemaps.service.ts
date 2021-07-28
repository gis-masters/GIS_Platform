import { AxiosError } from 'axios';

import { basemapsStore } from '../../stores/Basemaps.store';
import { currentProject } from '../../stores/CurrentProject.store';
import { communicationService } from '../communication.service';
import { PageableResponse, SortDir } from '../models';
import { CrgProject } from './projects.models';
import { Basemap } from './basemaps.models';
import { services } from '../services';
import { http } from '../http.service';
import {
  getBasemapsByIdsUrl,
  getBasemapsUrl,
  getProjectBasemapsUrl,
  getBasemapConnectionsUrl,
  getBasemapUrl
} from '../server-urls.service';
import { Toast } from '../../components/Toast/Toast';

interface ProjectBasemap {
  id: number;
  title: string;
  position: number;
  baseMapId: number;
}

export async function getBasemaps(
  page: number,
  pageSize: number,
  sort?: string,
  sortDir?: SortDir,
  filter?: { [key: string]: string }
): Promise<[Basemap[], number]> {
  const params = { page, size: pageSize, sort: sort ? `${sort},${sortDir}` : undefined, ...(filter || {}) };
  const response = await http.get<PageableResponse<{ basemaps: Basemap[] }>>(await getBasemapsUrl(), { params });

  return [(response._embedded && response._embedded.basemaps) || [], response.page.totalPages];
}

export async function deleteBasemap(basemapId: number): Promise<void> {
  await http.delete(await getBasemapUrl(basemapId));
  communicationService.basemapsUpdated.emit();
}

/**
 * Fetch all basemaps for project
 */
export async function fetchBasemaps(): Promise<void> {
  await services.provided;

  const projectBasemaps = await fetchProjectBasemaps(currentProject.id);
  if (!projectBasemaps.length) {
    basemapsStore.clear();

    return;
  }

  try {
    const params = { ids: projectBasemaps.map(item => String(item.baseMapId)).join(', ') };
    const url = await getBasemapsByIdsUrl();

    const response = await http.get<PageableResponse<{ basemaps: Basemap[] }>>(url, { params });
    if (response._embedded) {
      const crgBaseMaps = handleBasemaps(projectBasemaps, response._embedded.basemaps);
      basemapsStore.initBaseMaps(crgBaseMaps);
    }
  } catch (error) {
    services.logger.error('Подложки не подготовлены? ', error);
  }
}

export async function connectBasemapToProject(project: CrgProject, basemap: Basemap): Promise<void> {
  await http.post(await getProjectBasemapsUrl(project.id), {
    baseMapId: basemap.id,
    title: basemap.title
  });
}

export async function getBasemapConnections(basemapId: number): Promise<CrgProject[]> {
  try {
    return await http.get<CrgProject[]>(await getBasemapConnectionsUrl(basemapId));
  } catch (error) {
    const message = `Ошибка получения проектов относящихся к подложке: "${basemapId}"`;
    services.logger.error(message, error);
    Toast.error({ message, details: (error as AxiosError).message });
  }
}

// К подложкам применяются кастомизации указанные для них в проекте: сортируем по position, меняем title
function handleBasemaps(projectBaseMaps: ProjectBasemap[], basemaps: Basemap[]): Basemap[] {
  const result: Basemap[] = [];
  [...projectBaseMaps]
    .sort((a, b) => a.position - b.position || a.id - b.id)
    .forEach(projectBasemap => {
      const basemap = basemaps.find(({ id }) => id === projectBasemap.baseMapId);
      if (projectBasemap.title && basemap) {
        basemap.title = projectBasemap.title;
      }

      if (basemap) {
        result.push(basemap);
      }
    });

  return result;
}

/**
 * Fetch all project basemaps
 */
async function fetchProjectBasemaps(projectId: number): Promise<ProjectBasemap[]> {
  try {
    return await http.get<ProjectBasemap[]>(await getProjectBasemapsUrl(projectId));
  } catch (error) {
    services.logger.error('Не удалось получить подложки проекта.', error);
  }
}
