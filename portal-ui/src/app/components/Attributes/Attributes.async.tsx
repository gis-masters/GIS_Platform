import React, { Component } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';

import { communicationService, DataChangeEventDetail } from '../../services/communication.service';
import {
  extractFeatureTypeName,
  extractFeatureTypeNameFromComplexName,
  extractTableNameFromFeatureId
} from '../../services/geoserver/featureType/featureType.util';
import { CrgLayer, CrgVectorableLayer, CrgVectorLayer } from '../../services/gis/layers/layers.models';
import { getLayerByFeatureInCurrentProject } from '../../services/gis/layers/layers.utils';
import { editFeatureStore } from '../../services/map/a-map-mode/edit-feature/EditFeatureStore';
import { mapModeManager } from '../../services/map/a-map-mode/MapModeManager';
import { selectedFeaturesStore } from '../../services/map/a-map-mode/selected-features/SelectedFeatures.store';
import { MapMode } from '../../services/map/map.models';
import { PageOptions } from '../../services/models';
import { attributesTableStore } from '../../stores/AttributesTable.store';
import { currentProject } from '../../stores/CurrentProject.store';
import { XTableInvoke } from '../XTable/XTable';
import { AttributesBar } from './Bar/Attributes-Bar';
import { AttributesFooter } from './Footer/Attributes-Footer';
import { AttributesPagination } from './Pagination/Attributes-Pagination';
import { AttributesTabs } from './Tabs/Attributes-Tabs';

import '!style-loader!css-loader!sass-loader!./Attributes.scss';

const cnAttributes = cn('Attributes');

@observer
export default class Attributes extends Component<IClassNameProps> {
  @observable private causedByUserLayers: CrgVectorLayer[] = [];
  @observable private currentLayer?: CrgVectorLayer;
  @observable private tablePageOptions?: PageOptions;

  private tableInvoke: XTableInvoke = {};

  constructor(props: IClassNameProps) {
    super(props);
    makeObservable(this);
  }

  componentDidMount() {
    communicationService.minimizeAttributesBar.on(() => {
      this.minimizeBar();
    }, this);

    communicationService.openAttributesBar.on((e: CustomEvent<CrgVectorLayer>) => {
      this.openBar(e.detail);
    }, this);

    communicationService.layerUpdated.on((e: CustomEvent<DataChangeEventDetail<CrgLayer>>) => {
      const modifiedLayer = e.detail.data;
      const type = e.detail.type;

      switch (type) {
        case 'update': {
          const isLayerFilterExist = attributesTableStore.isLayerFilterExist(modifiedLayer);
          editFeatureStore.setLayer(modifiedLayer as CrgVectorableLayer);

          if (isLayerFilterExist) {
            if (modifiedLayer.id === this.currentLayer?.id) {
              this.tableInvoke?.reset?.();
            } else {
              attributesTableStore.updateFilter(modifiedLayer as CrgVectorLayer);
            }
          }

          break;
        }
        case 'delete': {
          this.closeTab(modifiedLayer as CrgVectorLayer);

          break;
        }
      }
    }, this);
  }

  componentWillUnmount() {
    communicationService.off(this);
  }

  render() {
    const { className } = this.props;

    return (
      <div className={cnAttributes(null, [className])}>
        {this.currentLayer && (
          <AttributesBar
            layer={this.currentLayer}
            onMinimize={this.minimizeBar}
            onClose={this.closeBar}
            onPageOptionsChange={this.setPageOptions}
            tableInvoke={this.tableInvoke}
          />
        )}
        <AttributesFooter>
          <AttributesTabs
            hard={this.hardTabs}
            soft={this.softTabs}
            onTabClose={this.closeTab}
            onTabMinimize={this.minimizeBar}
            currentLayer={this.currentLayer}
          />
          {this.tablePageOptions?.totalPages && this.tablePageOptions?.totalPages > 1 && (
            <AttributesPagination pageOptions={this.tablePageOptions} onChange={this.handlePagination} />
          )}
        </AttributesFooter>
      </div>
    );
  }

  @computed
  private get hardTabs(): CrgVectorLayer[] {
    return this.causedByUserLayers.filter(layer => currentProject.vectorableLayers.some(({ id }) => layer.id === id));
  }

  @computed
  private get softTabs(): CrgVectorLayer[] {
    const layers: CrgVectorLayer[] = [];

    for (const feature of selectedFeaturesStore.features) {
      if (
        ![...this.hardTabs, ...layers].some(
          ({ complexName }) => extractFeatureTypeName(feature.id) === extractFeatureTypeNameFromComplexName(complexName)
        )
      ) {
        const layer = getLayerByFeatureInCurrentProject(feature);

        if (layer && !this.hardTabs.some(({ complexName }) => complexName === layer.complexName)) {
          layers.push(layer);
        }
      }
    }

    return layers;
  }

  @action.bound
  private closeTab(layer: CrgVectorLayer) {
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
      ({ id }) => extractTableNameFromFeatureId(id) !== layer.tableName
    );

    if (selectedFeaturesWithoutLayer.length > 0) {
      void mapModeManager.changeMode(
        MapMode.SELECTED_FEATURES,
        {
          payload: { features: selectedFeaturesWithoutLayer }
        },
        'selectedFeaturesWithoutLayer-1'
      );
    } else {
      void mapModeManager.changeMode(MapMode.NONE, undefined, 'selectedFeaturesWithoutLayer-2');
    }
  }

  @action.bound
  private openBar(layer: CrgVectorLayer) {
    if (!this.causedByUserLayers.some(({ id }) => layer.id === id)) {
      this.causedByUserLayers.push(layer);
    }
    this.currentLayer = layer;
  }

  @boundMethod
  private closeBar() {
    if (this.currentLayer) {
      this.closeTab(this.currentLayer);
    }
  }

  @action.bound
  private minimizeBar() {
    this.currentLayer = undefined;
    this.tablePageOptions = undefined;

    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 0);
  }

  @action.bound
  private setPageOptions(pageOptions: PageOptions) {
    this.tablePageOptions = pageOptions;
  }

  @boundMethod
  private handlePagination(page: number) {
    if (this.tableInvoke?.paginate) {
      this.tableInvoke.paginate(page);
    }
  }
}
