import React, { Component } from 'react';
import { action, observable, makeObservable, IReactionDisposer, reaction } from 'mobx';
import { observer } from 'mobx-react';
import { LinearProgress } from '@mui/material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';
import { cloneDeep } from 'lodash';

import { attributesTableStore } from '../../../stores/AttributesTable.store';
import { filterLegendForCurrentMapView, getLayerStyleRules } from '../../../services/geoserver/styles/styles.service';
import { StyleRule } from '../../../services/geoserver/styles/styles.models';
import { CrgVectorLayer } from '../../../services/gis/layers/layers.models';
import { mapService } from '../../../services/map/map.service';
import { Emitter } from '../../../services/common/Emitter';
import { Legend } from '../../Legend/Legend';

import { LayerLegendFilterToggler } from '../LegendFilterToggler/Layer-LegendFilterToggler';

import '!style-loader!css-loader!sass-loader!./Layer-Legend.scss';

const cnLayerLegend = cn('Layer', 'Legend');

interface LayerLegendProps {
  layer: CrgVectorLayer;
}

@observer
export class LayerLegend extends Component<LayerLegendProps> {
  @observable private legend: StyleRule[] = [];
  @observable private filteredLegend: StyleRule[] = [];
  @observable private filterEnabled = true;
  private reactionDisposer?: IReactionDisposer;
  private operationId?: symbol;

  constructor(props: LayerLegendProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    mapService.mapMoved.on(async () => {
      await this.fetchFilteredLegend();
    }, this);

    this.reactionDisposer = reaction(
      () => [cloneDeep(attributesTableStore.filter), cloneDeep(attributesTableStore.filterDisabled)],
      async () => {
        await this.fetchFilteredLegend();
      },
      { fireImmediately: true }
    );

    this.setLegend(await getLayerStyleRules(this.props.layer));

    await this.fetchFilteredLegend();
  }

  componentWillUnmount() {
    if (this.reactionDisposer) {
      this.reactionDisposer();
    }
    Emitter.scopeOff(this);
  }

  render() {
    const legend: StyleRule[] = this.filterEnabled ? this.filteredLegend : this.legend;

    return (
      <div className={cnLayerLegend()}>
        {legend ? (
          <>
            {Boolean(this.legend.length) && (
              <LayerLegendFilterToggler enabled={this.filterEnabled} onClick={this.toggleFilter} />
            )}
            <Legend rules={legend} cleanDuplicates />
          </>
        ) : (
          <LinearProgress />
        )}
      </div>
    );
  }

  @boundMethod
  private async fetchFilteredLegend() {
    const { layer } = this.props;

    const operationId = Symbol();
    this.operationId = operationId;

    try {
      const filteredStylesResponse = await filterLegendForCurrentMapView([layer]);

      if (this.operationId !== operationId) {
        return;
      }

      const filteredLegend: StyleRule[] =
        this.legend?.filter(rule => {
          const resultItem = filteredStylesResponse.find(
            ({ dataset, identifier }) => dataset === layer.dataset && identifier === layer.tableName
          );

          return resultItem?.rules.includes(rule.name);
        }) || [];

      this.setFilteredLegend(filteredLegend);
    } catch {
      this.setFilteredLegend(this.legend);
    }
  }

  @action
  private setFilteredLegend(legend: StyleRule[]) {
    this.filteredLegend = legend;
  }

  @action.bound
  private toggleFilter() {
    this.filterEnabled = !this.filterEnabled;
  }

  @action
  private setLegend(legend: StyleRule[]) {
    this.legend = legend;
  }
}
