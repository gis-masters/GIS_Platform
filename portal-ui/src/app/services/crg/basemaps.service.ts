import { AxiosError } from 'axios';

import { basemapsStore } from '../../stores/Basemaps.store';
import { currentProject } from '../../stores/CurrentProject.store';
import { communicationService } from '../communication.service';
import { PageableResponse, PageOptions } from '../models';
import { CrgProject } from './projects.models';
import { Basemap } from './basemaps.models';
import { services } from '../services';
import { http } from '../http.service';
import { preparePageOptions } from '../http.utils';
import {
  getBasemapsByIdsUrl,
  getBasemapsUrl,
  getProjectBasemapsUrl,
  getBasemapConnectionsUrl,
  getBasemapUrl
} from '../server-urls.service';
import { Toast } from '../../components/Toast/Toast';
import { route } from '../../stores/Route.store';

interface ProjectBasemap {
  id: number;
  title: string;
  position: number;
  baseMapId: number;
}

export async function getBasemaps(pageOptions: PageOptions): Promise<[Basemap[], number]> {
  const params = preparePageOptions(pageOptions);
  const response = await http.get<PageableResponse<Basemap>>(await getBasemapsUrl(), { params });

  return [(response._embedded && response._embedded.basemaps) || [], response.page.totalPages];
}

export async function getBasemapsWithParticularOne(
  id: number,
  pageOptions: PageOptions
): Promise<[Basemap[], number, number] | undefined> {
  return await http.getPageWithObject<Basemap>(
    await getBasemapsUrl(),
    preparePageOptions(pageOptions),
    (item: Basemap) => item.id === id
  );
}

export async function getBasemap(basemapId: string): Promise<Basemap> {
  return await http.get(await getBasemapUrl(Number(basemapId)));
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
  if (!projectBasemaps?.length) {
    basemapsStore.clear();

    return;
  }

  try {
    const params = { ids: projectBasemaps.map(item => String(item.baseMapId)).join(', ') };
    const url = await getBasemapsByIdsUrl();

    const response = await http.get<PageableResponse<Basemap>>(url, { params });
    if (response._embedded) {
      const crgBaseMaps = handleBasemaps(projectBasemaps, response._embedded.basemaps);

      basemapsStore.initBaseMaps(crgBaseMaps);

      if (crgBaseMaps.length) {
        const queryParams = route.queryParams as { [key: string]: string };
        const basemap = queryParams?.basemap;

        if (!basemap) {
          await services.router.navigate([location.pathname], {
            queryParams: {
              basemap: crgBaseMaps[0].id
            },
            queryParamsHandling: 'merge'
          });
        }
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
