import React, { Component } from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { LinearProgress } from '@mui/material';
import { cn } from '@bem-react/classname';

import {
  filterLegendForCurrentMapView,
  getLayerStyleRules,
  StyleRule
} from '../../../services/geoserver/styles.service';
import { CrgLayer } from '../../../services/crg/projects.models';
import { mapService } from '../../../services/map/map.service';
import { Emitter } from '../../../services/common/Emitter';
import { Legend } from '../../Legend/Legend';

import { LayerLegendFilterToggler } from '../LegendFilterToggler/Layer-LegendFilterToggler';

import '!style-loader!css-loader!sass-loader!./Layer-Legend.scss';

const cnLayerLegend = cn('Layer', 'Legend');

interface LayerLegendProps {
  layer: CrgLayer;
}

@observer
export class LayerLegend extends Component<LayerLegendProps> {
  @observable private legend?: StyleRule[] = [];
  @observable private filteredLegend?: StyleRule[];
  @observable private filterEnabled = true;
  private legendRequestId?: symbol;

  async componentDidMount() {
    this.setLegend(await getLayerStyleRules(this.props.layer));

    await this.filterLegend();

    mapService.mapMoved.on(async () => {
      await this.filterLegend();
    }, this);
  }

  componentWillUnmount() {
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
