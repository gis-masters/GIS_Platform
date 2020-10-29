import { serverProperties } from '../server-properties.service';
import { CrgBaseMap, CrgProjectBaseMap } from './base-maps.models';
import { baseMapsStore } from '../../stores/BaseMaps.store';
import { services } from '../services';
import { PageableResponse } from '../models';
import { http } from '../http.service';

/**
 * Fetch all basemaps for project
 */
export async function fetchAllBaseMaps(baseMaps: CrgProjectBaseMap[]) {
  await services.provided;

  const params = {'ids': baseMaps.map(value => String(value.baseMapId)).join(', ')};

  const url = (await serverProperties.dataUrl) + '/basemaps/search/findByIdIn';

  try {
    const response = await http.get<PageableResponse<{ basemaps: CrgBaseMap[] }>>(url, { params });
    if (response._embedded) {
      const crgBaseMaps = handleBaseMaps(baseMaps, response._embedded.basemaps);
      baseMapsStore.initBaseMaps(crgBaseMaps);
    }
  } catch (e) {
    services.logger.error('Подложки не подготовлены? ', e);
  }
}

// К подложкам применяются кастомизации указанные для них в проекте: сортируем по position, меняем title
function handleBaseMaps(projectBaseMaps: CrgProjectBaseMap[], baseMaps: CrgBaseMap[]): CrgBaseMap[] {
  const result: CrgBaseMap[] = [];
  projectBaseMaps
    .slice()
    .sort((a, b) => a.position - b.position || a.id - b.id)
    .forEach(projectBaseMap => {
      const crgBaseMap = baseMaps.find(baseMap => baseMap.id === projectBaseMap.baseMapId);
      if (projectBaseMap.title) {
        if (crgBaseMap) {
          crgBaseMap.title = projectBaseMap.title;
        }
      }

      if (crgBaseMap) {
        result.push(crgBaseMap);
      }
    });

  return result;
}
