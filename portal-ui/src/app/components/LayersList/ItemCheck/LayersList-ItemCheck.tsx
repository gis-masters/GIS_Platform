import React, { Component } from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import { Checkbox } from '@material-ui/core';

import { CrgLayer } from '../../../services/crg/projects.models';

export interface LayersListItemCheckProps {
  layer: CrgLayer;
  selected: boolean;

  onSelect([layer, enable]): void;
}

@observer
export class LayersListItemCheck extends Component<LayersListItemCheckProps> {
  render() {
    const { selected } = this.props;

    return <Checkbox checked={selected} onClick={this.handleToggle} />;
  }

  @action.bound
  private handleToggle() {
    this.props.onSelect([this.props.layer, !this.props.selected]);
  }
}
