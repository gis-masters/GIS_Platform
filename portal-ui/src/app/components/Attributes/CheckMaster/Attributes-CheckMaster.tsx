import React, { Component } from 'react';
import { action, computed, IReactionDisposer, makeObservable, observable, reaction } from 'mobx';
import { observer } from 'mobx-react';
import { Checkbox } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { cloneDeep } from 'lodash';

import { WfsFeature } from '../../../services/geoserver/wfs/wfs.models';
import { getFeatures } from '../../../services/geoserver/wfs/wfs.service';
import { CrgVectorLayer } from '../../../services/gis/layers/layers.models';
import { mapModeManager } from '../../../services/map/a-map-mode/MapModeManager';
import { selectedFeaturesStore } from '../../../services/map/a-map-mode/selected-features/SelectedFeatures.store';
import { MapMode, MapSelectionTypes } from '../../../services/map/map.models';
import { PageOptions } from '../../../services/models';
import { removeFieldFilter } from '../../../services/util/filters/filters';
import { FILTER_BY_SELECTION } from '../Attributes.models';

import '!style-loader!css-loader!sass-loader!./Attributes-CheckMaster.scss';

const cnAttributesCheckMaster = cn('Attributes', 'CheckMaster');

interface AttributesCheckMasterProps {
  layer: CrgVectorLayer;
  pageOptions?: PageOptions;
  featuresMatched: number;
  definitionQuery: string | undefined;
}

@observer
export class AttributesCheckMaster extends Component<AttributesCheckMasterProps> {
  @observable private allSelected = false;

  private reactionDisposer?: IReactionDisposer;
  private testSelectionAllnessOperationId?: symbol;
  private selectingAllOperationId?: symbol;

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
    this.reactionDisposer?.();
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
    return selectedFeaturesStore.featuresByTableName[this.props.layer.tableName] || [];
  }

  @boundMethod
  private async selectAll(e: React.ChangeEvent<HTMLInputElement>, checked: boolean) {
    if (checked) {
      const operationId = Symbol();
      this.selectingAllOperationId = operationId;
      const features = await this.getAllFeatures();

      if (this.selectingAllOperationId === operationId) {
        await mapModeManager.changeMode(
          MapMode.SELECTED_FEATURES,
          {
            payload: {
              features: features,
              type: MapSelectionTypes.REPLACE
            }
          },
          'selectAll-1'
        );
      }
    } else {
      await mapModeManager.changeMode(
        MapMode.SELECTED_FEATURES,
        {
          payload: {
            features: this.selectedFeatures,
            type: MapSelectionTypes.REMOVE
          }
        },
        'selectAll-2'
      );
    }
  }

  private async testSelectionAllness() {
    const { featuresMatched } = this.props;
    if (
      selectedFeaturesStore.limit !== this.selectedFeatures.length &&
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
    const { layer, pageOptions, definitionQuery } = this.props;
    const options = { ...cloneDeep(pageOptions), page: 0, pageSize: selectedFeaturesStore.limit };

    if (options.filter) {
      removeFieldFilter(options.filter, FILTER_BY_SELECTION);
      removeFieldFilter(options.filter, 'cutId');
    }

    const [features] = await getFeatures(layer, options, definitionQuery);

    return features;
  }
}
