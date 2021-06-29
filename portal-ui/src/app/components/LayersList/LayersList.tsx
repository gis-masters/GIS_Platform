import React, { Component, ReactNode } from 'react';
import { Checkbox } from '@material-ui/core';
import { boundMethod } from 'autobind-decorator';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { action, computed, observable } from 'mobx';

import { XTable } from '../XTable/XTable';
import { CrgLayer } from '../../services/crg/projects.models';
import { currentProject } from '../../stores/CurrentProject.store';

import { LayersListItemCheck } from './ItemCheck/LayersList-ItemCheck';
import { LayersListEmpty } from './Empty/LayersList-Empty';

import '!style-loader!css-loader!sass-loader!./LayersList.scss';
import '!style-loader!css-loader!sass-loader!./Header/LayersList-Header.scss';
import '!style-loader!css-loader!sass-loader!./SelectAll/LayersList-SelectAll.scss';

const cnLayersList = cn('LayersList');

enum SelectedState {
  'CLEAR',
  'INDETERMINATE',
  'ALL'
}

interface LayersListProps {
  onSelect(layers: CrgLayer[]);
}

@observer
export class LayersList extends Component<LayersListProps> {
  @observable private selectedLayers: CrgLayer[] = [];

  render() {
    return currentProject.vectorLayers.length ? (
      <XTable
        className={cnLayersList()}
        data={currentProject.vectorLayers}
        cols={[
          {
            title: (
              <Checkbox
                checked={this.selectedState === SelectedState.ALL}
                onChange={this.onSelectAllCheckboxChanged}
                indeterminate={this.selectedState === SelectedState.INDETERMINATE}
              />
            ),
            cellProps: { padding: 'checkbox' },
            renderCellContent: this.renderCheckbox
          },
          {
            title: 'Название',
            field: 'title',
            getIdBadge: ({ id }) => id,
            filtering: true,
            sorting: true,
            headerCellProps: { width: '100%' }
          }
        ]}
        defaultSort={{ field: 'title', asc: true }}
        secondarySortField='id'
        filterable
      />
    ) : (
      <LayersListEmpty />
    );
  }

  @boundMethod
  private renderCheckbox(layer: CrgLayer): ReactNode {
    return (
      <LayersListItemCheck layer={layer} selected={this.isItemSelected(layer)} onSelect={this.onSelectItemChanged} />
    );
  }

  @computed
  private get selectedState(): SelectedState {
    if (this.selectedLayers.length === 0) {
      return SelectedState.CLEAR;
    } else if (this.selectedLayers.length === currentProject.vectorLayers.length) {
      return SelectedState.ALL;
    }

    return SelectedState.INDETERMINATE;
  }

  @action.bound
  private onSelectAllCheckboxChanged() {
    this.selectedLayers =
      this.selectedState === SelectedState.INDETERMINATE || this.selectedState === SelectedState.CLEAR
        ? currentProject.vectorLayers
        : [];

    this.props.onSelect(this.selectedLayers);
  }

  @action.bound
  private onSelectItemChanged([layer, enabled]) {
    if (enabled) {
      this.selectedLayers.push(layer);
    } else {
      this.selectedLayers.splice(this.selectedLayers.indexOf(layer), 1);
    }

    this.props.onSelect(this.selectedLayers);
  }

  private isItemSelected(layer: CrgLayer) {
    return this.selectedLayers.includes(layer);
  }
}
