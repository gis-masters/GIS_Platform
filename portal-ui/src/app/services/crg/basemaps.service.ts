import { basemapsStore } from '../../stores/Basemaps.store';
import { Basemap, ProjectBasemap } from './basemaps.models';
import { getBasemapsByIdsUrl, getBasemapsUrl, getProjectBasemapsUrl } from '../server-urls.service';
import { PageableResponse, SortDir } from '../models';
import { CrgProject } from './projects.models';
import { services } from '../services';
import { http } from '../http.service';

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

/**
 * Fetch all basemaps for project
 */
export async function fetchProjectBasemaps(basemaps: ProjectBasemap[]) {
  await services.provided;
  const params = { ids: basemaps.map(value => String(value.baseMapId)).join(', ') };
  const url = await getBasemapsByIdsUrl();

  try {
    const response = await http.get<PageableResponse<{ basemaps: Basemap[] }>>(url, { params });
    if (response._embedded) {
      const crgBaseMaps = handleBasemaps(basemaps, response._embedded.basemaps);
      basemapsStore.initBaseMaps(crgBaseMaps);
    }
  } catch (e) {
    services.logger.error('Подложки не подготовлены? ', e);
  }
}

export async function connectBasemapToProject(project: CrgProject, basemap: Basemap) {
  await http.post(await getProjectBasemapsUrl(project.id), {
    baseMapId: basemap.id,
    title: basemap.title
  });
}

// К подложкам применяются кастомизации указанные для них в проекте: сортируем по position, меняем title
function handleBasemaps(projectBaseMaps: ProjectBasemap[], basemaps: Basemap[]): Basemap[] {
  const result: Basemap[] = [];
  projectBaseMaps
    .slice()
    .sort((a, b) => a.position - b.position || a.id - b.id)
    .forEach(projectBasemap => {
      const basemap = basemaps.find(({ id }) => id === projectBasemap.baseMapId);
      if (projectBasemap.title) {
        if (basemap) {
          basemap.title = projectBasemap.title;
        }
      }

      if (basemap) {
        result.push(basemap);
      }
    });

  return result;
}
