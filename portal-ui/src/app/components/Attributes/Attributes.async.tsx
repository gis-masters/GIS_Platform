import React, { Component } from 'react';
import { action, computed, observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { IClassNameProps } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { mapStore } from '../../stores/Map.store';
import { currentProject } from '../../stores/CurrentProject.store';
import { attributesTableStore } from '../../stores/AttributesTable.store';
import { getLayerByFeatureInCurrentProject } from '../../services/gis/layers.service';
import { mapSelectionService } from '../../services/map/map-selection.service';
import { communicationService } from '../../services/communication.service';
import { CrgVectorLayer } from '../../services/gis/projects.models';
import { PageOptions } from '../../services/models';
import { XTableInvoke } from '../XTable/XTable';

import { AttributesBar } from './Bar/Attributes-Bar';
import { AttributesTabs } from './Tabs/Attributes-Tabs';
import { AttributesFooter } from './Footer/Attributes-Footer';
import { AttributesPagination } from './Pagination/Attributes-Pagination';

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
    communicationService.openAttributesBar.on(this.openBar, this);
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
          {this.tablePageOptions?.totalPages > 1 && (
            <AttributesPagination pageOptions={this.tablePageOptions} onChange={this.handlePagination} />
          )}
        </AttributesFooter>
      </div>
    );
  }

  @computed
  private get hardTabs(): CrgVectorLayer[] {
    return this.causedByUserLayers.filter(layer => currentProject.vectorLayers.some(({ id }) => layer.id === id));
  }

  @computed
  private get softTabs(): CrgVectorLayer[] {
    const layers: CrgVectorLayer[] = [];

    for (const feature of mapStore.selectedFeatures) {
      if (![...this.hardTabs, ...layers].some(({ tableName }) => feature.id.split('.')[0] === tableName)) {
        const layer = getLayerByFeatureInCurrentProject(feature);
        if (layer) {
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

    const selectedFeaturesWithoutLayer = mapStore.selectedFeatures.filter(
      ({ id }) => id.split('.')[0] !== layer.tableName
    );

    mapSelectionService.selectFeatures(selectedFeaturesWithoutLayer);
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
    this.closeTab(this.currentLayer);
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
    if (this.tableInvoke.paginate) {
      this.tableInvoke.paginate(page);
    }
  }
}
