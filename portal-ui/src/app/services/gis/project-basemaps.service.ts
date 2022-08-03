import { AxiosError } from 'axios';

import { route } from '../../stores/Route.store';
import { basemapsStore } from '../../stores/Basemaps.store';
import { currentProject } from '../../stores/CurrentProject.store';
import { getBasemapConnectionsUrl, getBasemapsByIdsUrl, getProjectBasemapsUrl } from '../server-urls.service';
import { CrgProject } from './projects.models';
import { Basemap } from '../data/basemaps.models';
import { http } from '../http.service';
import { services } from '../services';
import { Toast } from '../../components/Toast/Toast';

interface ProjectBasemap {
  id: number;
  title: string;
  position: number;
  baseMapId: number;
}

/**
 * Fetch all basemaps for project
 */
export async function fetchBasemaps(): Promise<void> {
  await services.provided;

  const projectBasemaps = await fetchProjectBasemaps(currentProject.id);
  if (!projectBasemaps?.length) {
    basemapsStore.clear();

    return;
  }

  try {
    const params = { ids: projectBasemaps.map(item => String(item.baseMapId)).join(', ') };
    const url = await getBasemapsByIdsUrl();

    const basemaps = handleBasemaps(projectBasemaps, await http.getPaged<Basemap>(url, { params }));

    basemapsStore.initBasemaps(basemaps);

    if (basemaps.length) {
      const queryParams = route.queryParams as { [key: string]: string };
      const basemap = queryParams?.basemap;

      if (!basemap) {
        await services.router.navigate([location.pathname], {
          queryParams: {
            basemap: basemaps[0].id
          },
          queryParamsHandling: 'merge'
        });
      }
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
