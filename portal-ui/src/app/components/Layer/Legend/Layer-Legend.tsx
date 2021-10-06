import React, { Component } from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { LinearProgress } from '@mui/material';
import { cn } from '@bem-react/classname';

import { filterLegendForCurrentMapView, loadLayerStyle, Rule } from '../../../services/geoserver/styles.service';
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
  @observable private filterEnabled = true;
  @observable private filteredLegend?: Rule[];
  private filteredLegendRequestId?: symbol;

  async componentDidMount() {
    await loadLayerStyle(this.props.layer);

    await this.filterLegend();

    mapService.mapMoved.on(async () => {
      await this.filterLegend();
    }, this);
  }

  componentWillUnmount() {
    Emitter.scopeOff(this);
  }

  render() {
    const { layer } = this.props;
    const legend: Rule[] = this.filterEnabled ? this.filteredLegend : layer.style;

    return (
      <div className={cnLayerLegend()}>
        {legend ? (
          <>
            {Boolean(layer.style?.length) && (
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

    const filteredLegendRequestId = Symbol();
    this.filteredLegendRequestId = filteredLegendRequestId;

    const filteredStylesResponse = await filterLegendForCurrentMapView([layer]);

    // если за время обращения к api случился следующий запрос
    if (this.filteredLegendRequestId !== filteredLegendRequestId) {
      return;
    }

    const filteredLegend: Rule[] =
      layer.style?.filter(rule => {
        const resultItem = filteredStylesResponse.find(
          ({ dataset, identifier }) => dataset === layer.dataset && identifier === layer.tableName
        );

        return resultItem?.rules.includes(rule.name);
      }) || [];

    this.setFilteredLegend(filteredLegend);
  }

  @action
  private setFilteredLegend(legend: Rule[]) {
    this.filteredLegend = legend;
  }

  @action.bound
  private toggleFilter() {
    this.filterEnabled = !this.filterEnabled;
  }
}
