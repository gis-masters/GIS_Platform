import React, { Component, ChangeEvent } from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { Slider } from '@material-ui/core';

import { CrgLayer, CrgLayersGroup } from '../../../services/crg/projects.models';

import { LayerTransparencyLabel } from '../TransparencyLabel/Layer-TransparencyLabel';

import '!style-loader!css-loader!sass-loader!./Layer-Transparency.scss';

const cnLayerTransparency = cn('Layer', 'Transparency');

interface LayerTransparencyProps {
  entity: CrgLayer | CrgLayersGroup;
}

@observer
export class LayerTransparency extends Component<LayerTransparencyProps> {
  render() {
    const { transparency } = this.props.entity;

    return (
      <div className={cnLayerTransparency()}>
        <Slider value={transparency} min={5} max={100} step={1} onChange={this.handleChange} />
        <LayerTransparencyLabel value={transparency} />
      </div>
    );
  }

  @action.bound
  private handleChange(e: ChangeEvent, value: number) {
    this.props.entity.transparency = value;
  }
}
