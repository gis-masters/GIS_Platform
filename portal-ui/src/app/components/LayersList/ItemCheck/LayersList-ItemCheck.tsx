import React, { Component } from 'react';
import { action, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Checkbox } from '@mui/material';

import { CrgLayer } from '../../../services/gis/layers/layers.models';

export interface LayersListItemCheckProps {
  layer: CrgLayer;
  selected: boolean;

  onSelect([layer, enable]: [CrgLayer, boolean]): void;
}

@observer
export class LayersListItemCheck extends Component<LayersListItemCheckProps> {
  constructor(props: LayersListItemCheckProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { selected } = this.props;

    return <Checkbox checked={selected} onClick={this.handleToggle} />;
  }

  @action.bound
  private handleToggle() {
    this.props.onSelect([this.props.layer, !this.props.selected]);
  }
}
