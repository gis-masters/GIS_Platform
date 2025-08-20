import React, { Component } from 'react';
import { action, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Slider } from '@mui/material';
import { cn } from '@bem-react/classname';

import { TreeItemPayload } from '../../../services/gis/projects/projects.models';
import { LayerTransparencyLabel } from '../TransparencyLabel/Layer-TransparencyLabel';

import '!style-loader!css-loader!sass-loader!./Layer-Transparency.scss';

const cnLayerTransparency = cn('Layer', 'Transparency');

interface LayerTransparencyProps {
  entity: TreeItemPayload;
}

@observer
export class LayerTransparency extends Component<LayerTransparencyProps> {
  constructor(props: LayerTransparencyProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { transparency } = this.props.entity;

    return (
      <div className={cnLayerTransparency()}>
        <Slider value={transparency} min={5} max={100} step={1} onChange={this.handleChange} />
        <LayerTransparencyLabel value={transparency || 100} />
      </div>
    );
  }

  @action.bound
  private handleChange(e: Event, value: number | number[]) {
    if (Array.isArray(value)) {
      throw new TypeError('Слайдер не должен быть multiple');
    }
    this.props.entity.transparency = value;
  }
}
