import { AxiosError } from 'axios';

import { route } from '../../../stores/Route.store';
import { basemapsStore } from '../../../stores/Basemaps.store';
import { currentProject } from '../../../stores/CurrentProject.store';
import { getBasemapsByIds } from '../../data/basemaps/basemaps.service';
import { Basemap } from '../../data/basemaps/basemaps.models';
import { CrgProject } from '../projects/projects.models';
import { Toast } from '../../../components/Toast/Toast';
import { services } from '../../services';

import { projectBasemapClient } from './project-basemaps.client';
import { ProjectBasemap } from './project-basemaps.models';

export async function fetchBasemaps(): Promise<void> {
  await services.provided;

  try {
    const projectBasemaps = await projectBasemapClient.getProjectBasemaps(currentProject.id);

    if (!projectBasemaps?.length) {
      basemapsStore.clear();

      return;
    }

    const basemaps = handleBasemaps(
      projectBasemaps,
      await getBasemapsByIds(projectBasemaps.map(item => item.baseMapId))
    );

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
    services.logger.error('Не удалось получить подложки проекта.', error);
  }
}

export async function connectBasemapToProject(project: CrgProject, basemap: Basemap): Promise<void> {
  await projectBasemapClient.connectBasemapToProject(project.id, basemap.id, basemap.title);
}

export async function getBasemapConnections(basemap: Basemap): Promise<CrgProject[]> {
  try {
    return await projectBasemapClient.getBasemapConnections(basemap.id);
  } catch (error) {
    const message = `Ошибка получения проектов относящихся к подложке: "${basemap.id}"`;
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
