import React, { useCallback, useEffect, useRef } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { type IClassNameProps } from '@bem-react/core';

import { communicationService, type DataChangeEventDetail } from '../../services/communication.service';
import {
  extractFeatureTypeName,
  extractFeatureTypeNameFromComplexName,
  extractResourceIdFromFeatureId
} from '../../services/geoserver/featureType/featureType.util';
import { type CrgLayer, type CrgVectorableLayer, type CrgVectorLayer } from '../../services/gis/layers/layers.models';
import { isExternalLayer } from '../../services/gis/layers/layers.typeguards';
import { getLayerByFeatureInCurrentProject } from '../../services/gis/layers/layers.utils';
import { MapMode } from '../../services/map/map.models';
import { mapModeService } from '../../services/map/mode/map-mode.service';
import { type PageOptions } from '../../services/models';
import { attributesTableStore } from '../../stores/AttributesTable.store';
import { currentProject } from '../../stores/CurrentProject.store';
import { editFeatureStore } from '../../stores/EditFeature.store';
import { selectedFeaturesStore } from '../../stores/SelectedFeatures.store';
import { type XTableInvoke } from '../XTable/XTable';
import { AttributesBar } from './Bar/Attributes-Bar';
import { AttributesFooter } from './Footer/Attributes-Footer';
import { AttributesPagination } from './Pagination/Attributes-Pagination';
import { AttributesTabs } from './Tabs/Attributes-Tabs';

import './Attributes.scss';

const cnAttributes = cn('Attributes');

function getHardTabs(causedByUserLayers: CrgVectorLayer[]): CrgVectorLayer[] {
  return causedByUserLayers.filter(layer =>
    currentProject.vectorableLayers.some(vectorableLayer => layer.id === vectorableLayer.id)
  );
}

function getSoftTabs(hardTabs: CrgVectorLayer[]): CrgVectorLayer[] {
  const layers: CrgVectorLayer[] = [];

  for (const feature of selectedFeaturesStore.features) {
    const featureTypeName = extractFeatureTypeName(feature.id);
    const isDuplicate = [...hardTabs, ...layers].some(
      ({ complexName }) => featureTypeName === extractFeatureTypeNameFromComplexName(complexName)
    );

    if (isDuplicate) {
      continue;
    }

    const layer = getLayerByFeatureInCurrentProject(feature);

    if (layer && !isExternalLayer(layer) && !hardTabs.some(({ complexName }) => complexName === layer.complexName)) {
      layers.push(layer);
    }
  }

  return layers;
}

type AttributesState = {
  causedByUserLayers: CrgVectorLayer[];
  currentLayer?: CrgVectorLayer;
  tablePageOptions?: PageOptions;

  get hardTabs(): CrgVectorLayer[];
  get softTabs(): CrgVectorLayer[];

  closeTab(layer: CrgVectorLayer): void;
  openBar(layer: CrgVectorLayer): void;
  closeBar(): void;
  minimizeBar(): void;
  setPageOptions(pageOptions: PageOptions): void;
};

const Attributes = observer(function Attributes({ className }: IClassNameProps) {
  const tableInvoke = useRef<XTableInvoke>({});

  const state = useLocalObservable<AttributesState>(() => ({
    causedByUserLayers: [],
    currentLayer: undefined,
    tablePageOptions: undefined,

    get hardTabs() {
      return getHardTabs(this.causedByUserLayers);
    },

    get softTabs() {
      return getSoftTabs(this.hardTabs);
    },

    closeTab(layer) {
      attributesTableStore.updateFilter(layer);

      if (this.currentLayer?.id === layer.id) {
        this.currentLayer = undefined;
        this.tablePageOptions = undefined;
      }
      const index = this.causedByUserLayers.findIndex(({ id }) => layer.id === id);
      if (index !== -1) {
        this.causedByUserLayers.splice(index, 1);
      }

      const selectedFeaturesWithoutLayer = selectedFeaturesStore.features.filter(
        ({ id }) => extractResourceIdFromFeatureId(id) !== layer.resourceId
      );

      if (selectedFeaturesWithoutLayer.length > 0) {
        void mapModeService.changeMode(
          MapMode.SELECTED_FEATURES,
          {
            payload: { features: selectedFeaturesWithoutLayer }
          },
          'selectedFeaturesWithoutLayer-1'
        );
      } else {
        void mapModeService.changeMode(MapMode.NONE, undefined, 'selectedFeaturesWithoutLayer-2');
      }
    },

    openBar(layer) {
      if (!this.causedByUserLayers.some(({ id }) => layer.id === id)) {
        this.causedByUserLayers.push(layer);
      }
      this.currentLayer = layer;
    },

    closeBar() {
      if (this.currentLayer) {
        this.closeTab(this.currentLayer);
      }
    },

    minimizeBar() {
      this.currentLayer = undefined;
      this.tablePageOptions = undefined;

      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 0);
    },

    setPageOptions(pageOptions) {
      this.tablePageOptions = pageOptions;
    }
  }));

  const handlePagination = useCallback((page: number) => {
    if (tableInvoke.current?.paginate) {
      tableInvoke.current.paginate(page);
    }
  }, []);

  useEffect(() => {
    const scope = {};

    communicationService.minimizeAttributesBar.on(() => {
      state.minimizeBar();
    }, scope);

    communicationService.openAttributesBar.on((e: CustomEvent<CrgVectorLayer>) => {
      state.openBar(e.detail);
    }, scope);

    communicationService.layerUpdated.on((e: CustomEvent<DataChangeEventDetail<CrgLayer>>) => {
      const modifiedLayer = e.detail.data;
      const type = e.detail.type;

      switch (type) {
        case 'update': {
          const isLayerFilterExist = attributesTableStore.isLayerFilterExist(modifiedLayer);
          editFeatureStore.setLayer(modifiedLayer as CrgVectorableLayer);

          if (isLayerFilterExist) {
            if (modifiedLayer.id === state.currentLayer?.id) {
              tableInvoke.current?.reset?.();
            } else {
              attributesTableStore.updateFilter(modifiedLayer as CrgVectorLayer);
            }
          }

          break;
        }
        case 'delete': {
          state.closeTab(modifiedLayer as CrgVectorLayer);

          break;
        }
      }
    }, scope);

    return () => {
      communicationService.off(scope);
    };
  }, [state]);

  return (
    <div className={cnAttributes(null, [className])}>
      {state.currentLayer && (
        <AttributesBar
          layer={state.currentLayer}
          onMinimize={state.minimizeBar}
          onClose={state.closeBar}
          onPageOptionsChange={state.setPageOptions}
          tableInvoke={tableInvoke.current}
        />
      )}
      <AttributesFooter>
        <AttributesTabs
          hard={state.hardTabs}
          soft={state.softTabs}
          onTabClose={state.closeTab}
          onTabMinimize={state.minimizeBar}
          currentLayer={state.currentLayer}
        />
        {state.tablePageOptions?.totalPages && state.tablePageOptions?.totalPages > 1 && (
          <AttributesPagination pageOptions={state.tablePageOptions} onChange={handlePagination} />
        )}
      </AttributesFooter>
    </div>
  );
});

export default Attributes;
