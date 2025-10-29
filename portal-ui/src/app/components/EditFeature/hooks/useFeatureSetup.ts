import { useEffect } from 'react';

import { getFeatureProjection } from '../../../services/data/projections/projections.service';
import { type WfsFeature } from '../../../services/geoserver/wfs/wfs.models';
import { type CrgVectorableLayer, type CrgVectorLayer } from '../../../services/gis/layers/layers.models';
import { type EditFeatureMode } from '../../../services/map/a-map-mode/edit-feature/EditFeature.models';
import { editFeatureStore } from '../../../services/map/a-map-mode/edit-feature/EditFeatureStore';
import { services } from '../../../services/services';

export const useFeatureSetup = (
  features: WfsFeature[],
  layer: CrgVectorableLayer | CrgVectorLayer | undefined,
  mode: EditFeatureMode
): void => {
  useEffect(() => {
    let isMounted = true;

    if (!features?.length) {
      return;
    }

    const fetchData = async () => {
      try {
        if (isMounted) {
          const projection = await getFeatureProjection(features[0]);
          if (projection) {
            editFeatureStore.setCurrentProjection(projection);
            editFeatureStore.setEditFeaturesData({
              features,
              mode,
              layer
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
  }, [features, layer, mode]);
};
