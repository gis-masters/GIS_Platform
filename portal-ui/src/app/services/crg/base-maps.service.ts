import { HttpParams } from '@angular/common/http';

import { serverProperties } from '../server-properties.service';
import { CrgBaseMap, CrgProjectBaseMap, SourceType } from './base-maps.models';
import { baseMapsStore } from '../../stores/BaseMaps.store';
import { services } from '../services';
import { CrgApiResponse } from './models';

/**
 * Fetch all basemaps for project
 */
export async function fetchAllBaseMaps(baseMaps: CrgProjectBaseMap[]) {
  await services.provided;

  let params = new HttpParams();
  params = params.append('ids', baseMaps.map(value => String(value.baseMapId)).join(', '));

  const url = (await serverProperties.dataServerUrl) + '/basemaps/search/findByIdIn';
  services.httpq
    .get<CrgApiResponse<{ basemaps: CrgBaseMap[] }>>(url, { params })
    .then(
      response => {
        if (response._embedded) {
          const crgBaseMaps = handleBaseMaps(baseMaps, response._embedded.basemaps);

          baseMapsStore.initBaseMaps(crgBaseMaps);
        } else {
          baseMapsStore.initBaseMaps([]);
        }
      },
      reason => {
        console.error('Подложки не подготовлены?: ', reason);

        const osmBaseMap = { title: 'OSM', thumbnailUrn: '/assets/images/thumbnail-osm.jpg', type: SourceType.OSM };
        baseMapsStore.initBaseMaps([osmBaseMap]);
      }
    );
}

// К подложкам применяются кастомизации указанные для них в проекте: сортируем по position, меняем title
function handleBaseMaps(projectBaseMaps: CrgProjectBaseMap[], baseMaps: CrgBaseMap[]): CrgBaseMap[] {
  const result: CrgBaseMap[] = [];
  projectBaseMaps
    .slice()
    .sort((a, b) => a.position - b.position)
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
