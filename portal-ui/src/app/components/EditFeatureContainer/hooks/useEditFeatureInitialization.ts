/* eslint-disable max-params */
import { useEffect } from 'react';

import { extractFeatureId } from '../../../services/geoserver/featureType/featureType.util';
import { WfsFeature } from '../../../services/geoserver/wfs/wfs.models';
import { CrgVectorableLayer, CrgVectorLayer } from '../../../services/gis/layers/layers.models';
import { getLayerByFeatureInCurrentProject } from '../../../services/gis/layers/layers.utils';
import { EditFeatureMode } from '../../../services/map/a-map-mode/edit-feature/EditFeature.models';
import { editFeatureStore } from '../../../services/map/a-map-mode/edit-feature/EditFeatureStore';
import { sidebars } from '../../../stores/Sidebars.store';
import { ShouldRender } from './useEditFeatureState';

export const useEditFeatureInitialization = (
  features: WfsFeature[],
  isNew: boolean,
  shouldRender: ShouldRender,
  setMode: (mode: EditFeatureMode) => void,
  setFeatures: (features: WfsFeature[]) => void,
  setLayer: (layer?: CrgVectorableLayer | CrgVectorLayer) => void,
  setIsNew: (isNew: boolean) => void,
  setSelectedTab: (tab: number) => void,
  setShouldRender: (shouldRender: ShouldRender) => void
): void => {
  useEffect(() => {
    const data = editFeatureStore.editFeaturesData;
    if (!data || !data.features) {
      setShouldRender({ ...shouldRender, noData: true, noFeature: false });

      return;
    }

    setMode(data.mode);
    setFeatures(data.features);
    const currentLayer = data.layer || getLayerByFeatureInCurrentProject(data.features[0]);
    setLayer(currentLayer);

    if (currentLayer) {
      sidebars.setLayerOfEditedFeature(currentLayer);
    }

    if (!data.features[0]) {
      setShouldRender({ ...shouldRender, noData: false, noFeature: true });

      return;
    }

    const checkIsNew = (firstFeature: WfsFeature): void => {
      const id = firstFeature?.id.split('.');

      if (firstFeature?.id === undefined || id.at(-1) === '0') {
        setIsNew(true);

        return;
      }
      setIsNew(extractFeatureId(firstFeature?.id) === 0);
    };

    checkIsNew(data.features[0]);

    setSelectedTab(editFeatureStore.geometryErrorMessage ? 1 : Number(isNew));
  }, [
    features,
    shouldRender,
    isNew,
    editFeatureStore.editFeaturesData,
    setMode,
    setFeatures,
    setLayer,
    setIsNew,
    setSelectedTab,
    setShouldRender
  ]);
};
