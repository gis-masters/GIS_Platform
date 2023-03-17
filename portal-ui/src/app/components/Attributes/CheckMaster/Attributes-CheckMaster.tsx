import React, { Component } from 'react';
import { action, computed, IReactionDisposer, observable, reaction, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Checkbox } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { cloneDeep } from 'lodash';

import { MapSelectionTypes, mapStore } from '../../../stores/Map.store';
import { mapSelectionService } from '../../../services/map/map-selection.service';
import { CrgVectorLayer } from '../../../services/gis/projects/projects.models';
import { getFeatures } from '../../../services/geoserver/wfs/wfs.service';
import { WfsFeature } from '../../../services/geoserver/wfs/wfs.models';
import { PageOptions } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./Attributes-CheckMaster.scss';

const cnAttributesCheckMaster = cn('Attributes', 'CheckMaster');

interface AttributesCheckMasterProps {
  layer: CrgVectorLayer;
  pageOptions: PageOptions;
  featuresMatched: number;
}

@observer
export class AttributesCheckMaster extends Component<AttributesCheckMasterProps> {
  @observable private allSelected = false;
  private reactionDisposer: IReactionDisposer;
  private testSelectionAllnessOperationId: symbol;
  private selectingAllOperationId: symbol;

  constructor(props: AttributesCheckMasterProps) {
    super(props);
    makeObservable(this);
  }

  componentDidMount() {
    this.reactionDisposer = reaction(
      () => {
        const { pageOptions, layer } = this.props;

        return [cloneDeep(pageOptions), layer.id, this.selectedFeatures];
      },
      async () => {
        await this.testSelectionAllness();
      }
    );
  }

  componentWillUnmount() {
    this.reactionDisposer();
  }

  render() {
    return (
      <Checkbox
        className={cnAttributesCheckMaster()}
        indeterminate={this.selectedFeatures.length > 0 && !this.allSelected}
        checked={this.allSelected}
        onChange={this.selectAll}
      />
    );
  }

  @computed
  get selectedFeatures(): WfsFeature[] {
    return mapStore.selectedFeaturesByTableName[this.props.layer.tableName] || [];
  }

  @boundMethod
  private async selectAll(e: React.ChangeEvent<HTMLInputElement>, checked: boolean) {
    if (checked) {
      const operationId = Symbol();
      this.selectingAllOperationId = operationId;
      const features = await this.getAllFeatures();
      if (this.selectingAllOperationId === operationId) {
        mapSelectionService.selectFeatures(this.selectedFeatures, MapSelectionTypes.REMOVE);
        mapSelectionService.selectFeatures(features, MapSelectionTypes.ADD);
      }
    } else {
      mapSelectionService.selectFeatures(this.selectedFeatures, MapSelectionTypes.REMOVE);
    }
  }

  private async testSelectionAllness() {
    const { featuresMatched } = this.props;
    if (
      mapStore.selectingFeaturesLimit !== this.selectedFeatures.length &&
      featuresMatched !== this.selectedFeatures.length
    ) {
      this.setSelectionAllness(false);

      return;
    }

    const operationId = Symbol();
    this.testSelectionAllnessOperationId = operationId;

    const allFeatures = await this.getAllFeatures();
    if (!allFeatures || this.testSelectionAllnessOperationId !== operationId) {
      return;
    }

    for (const feature of allFeatures) {
      if (!this.selectedFeatures.some(({ id }) => feature.id === id)) {
        this.setSelectionAllness(false);

        return;
      }
    }

    this.setSelectionAllness(true);
  }

  @action
  private setSelectionAllness(all: boolean) {
    this.allSelected = all;
  }

  private async getAllFeatures(): Promise<WfsFeature[]> {
    const { layer, pageOptions } = this.props;
    const options = cloneDeep(pageOptions);
    delete options.filter?.filterBySelection;
    const [features] = await getFeatures(layer, { ...options, page: 0, pageSize: mapStore.selectingFeaturesLimit });

    return features;
  }
}
