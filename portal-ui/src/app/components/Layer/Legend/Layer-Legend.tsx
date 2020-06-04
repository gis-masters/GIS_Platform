import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { LinearProgress } from '@material-ui/core';

import { loadLayerLegend } from '../../../services/geoserver/layers.service';
import { CrgLayer } from '../../../services/crg/projects.models';
import { Legend } from '../../Legend/Legend';

const cnLayerLegend = cn('Layer', 'Legend');

interface LayerLegendProps {
  layer: CrgLayer;
}

@observer
export class LayerLegend extends Component<LayerLegendProps> {
  constructor (props: LayerLegendProps) {
    super(props);
  }

  componentDidMount () {
    loadLayerLegend(this.props.layer);
  }

  render () {
    const { layer } = this.props;

    return (
      <div className={cnLayerLegend()}>
        {layer.legend ? <Legend rules={layer.legend} /> : <LinearProgress />}
      </div>
    );
  }
}
