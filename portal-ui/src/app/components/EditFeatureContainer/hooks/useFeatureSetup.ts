import { useEffect } from 'react';

import { getFeatureProjection } from '../../../services/data/projections/projections.service';
import { WfsFeature } from '../../../services/geoserver/wfs/wfs.models';
import { CrgVectorableLayer, CrgVectorLayer } from '../../../services/gis/layers/layers.models';
import { EditFeatureMode } from '../../../services/map/a-map-mode/edit-feature/EditFeature.models';
import { editFeatureStore } from '../../../services/map/a-map-mode/edit-feature/EditFeatureStore';
import { services } from '../../../services/services';

export const useFeatureSetup = (
  feature: WfsFeature | undefined,
  layer: CrgVectorableLayer | CrgVectorLayer | undefined
): void => {
  useEffect(() => {
    let isMounted = true;

    if (!feature) {
      return;
    }

    const fetchData = async () => {
      try {
        if (isMounted) {
          const projection = await getFeatureProjection(feature);
          if (projection) {
            editFeatureStore.setCurrentProjection(projection);
            editFeatureStore.setEditFeaturesData({
              features: [feature],
              mode: EditFeatureMode.single,
              layer: layer
            });
          } else {
            services.logger.error('Не удалось получить проекцию или геометрию объекта');
          }
        }
      } catch (error) {
        services.logger.error('Ошибка инициализации геометрии:', error);
      }
    };

    void fetchData();

    return () => {
      isMounted = false;
    };
  }, [feature, layer]);
};
