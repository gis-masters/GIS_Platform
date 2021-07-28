import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { LinearProgress } from '@material-ui/core';

import { loadLayerStyle } from '../../../services/geoserver/styles.service';
import { CrgLayer } from '../../../services/crg/projects.models';
import { Legend } from '../../Legend/Legend';

const cnLayerLegend = cn('Layer', 'Legend');

interface LayerLegendProps {
  layer: CrgLayer;
}

@observer
export class LayerLegend extends Component<LayerLegendProps> {
  async componentDidMount() {
    await loadLayerStyle(this.props.layer);
  }

  render() {
    const { layer } = this.props;

    return (
      <div className={cnLayerLegend()}>
        {layer.style ? <Legend rules={layer.style} cleanDuplicates /> : <LinearProgress />}
      </div>
    );
  }
}
