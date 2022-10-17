import React, { Component } from 'react';
import { action, observable, makeObservable, IReactionDisposer, reaction } from 'mobx';
import { observer } from 'mobx-react';
import { LinearProgress } from '@mui/material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';
import { cloneDeep } from 'lodash';

import {
  filterLegendForCurrentMapView,
  getLayerStyleRules,
  StyleRule
} from '../../../services/geoserver/styles.service';
import { attributesTableStore } from '../../../stores/AttributesTable.store';
import { CrgVectorLayer } from '../../../services/gis/projects.models';
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
  @observable private legend?: StyleRule[] = [];
  @observable private filteredLegend?: StyleRule[];
  @observable private filterEnabled = true;
  private pagedDataReactionDisposer: IReactionDisposer;
  private legendRequestId?: symbol;

  constructor(props: LayerLegendProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    this.setLegend(await getLayerStyleRules(this.props.layer));

    await this.filterLegend();

    mapService.mapMoved.on(async () => {
      await this.filterLegend();
    }, this);

    this.pagedDataReactionDisposer = reaction(
      () => [cloneDeep(attributesTableStore.filter), cloneDeep(attributesTableStore.filterDisabled)],
      () => {
        void this.filterLegend();
      },
      {
        fireImmediately: true
      }
    );
  }

  componentWillUnmount() {
    this.pagedDataReactionDisposer();
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
  private async filterLegend() {
    const { layer } = this.props;

    const legendRequestId = Symbol();
    this.legendRequestId = legendRequestId;

    try {
      const filteredStylesResponse = await filterLegendForCurrentMapView([layer]);

      // если за время обращения к api случился следующий запрос
      if (this.legendRequestId !== legendRequestId) {
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
      this.setFilteredLegend(this.legend || []);
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
