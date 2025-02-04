import React, { Component, ReactElement } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Checkbox } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { CrgLayer } from '../../services/gis/layers/layers.models';
import { XTable } from '../XTable/XTable';
import { LayersListEmpty } from './Empty/LayersList-Empty';
import { LayersListItemCheck } from './ItemCheck/LayersList-ItemCheck';

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
  layers: CrgLayer[];
  onSelect(layers: CrgLayer[]): void;
}

@observer
export class LayersList extends Component<LayersListProps> {
  @observable private selectedLayers: CrgLayer[] = [];

  constructor(props: LayersListProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { layers } = this.props;

    return layers?.length && this.selectedLayers ? (
      <XTable
        className={cnLayersList()}
        data={layers}
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
            CellContent: this.renderCheckbox
          },
          {
            title: 'Название',
            field: 'title',
            getIdBadge: ({ id }) => id,
            filterable: true,
            sortable: true,
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
  private renderCheckbox({ rowData }: { rowData: CrgLayer }): ReactElement {
    return (
      <LayersListItemCheck
        layer={rowData}
        selected={this.isItemSelected(rowData)}
        onSelect={this.onSelectItemChanged}
      />
    );
  }

  @computed
  private get selectedState(): SelectedState {
    if (this.selectedLayers.length === 0) {
      return SelectedState.CLEAR;
    } else if (this.selectedLayers.length === this.props.layers.length) {
      return SelectedState.ALL;
    }

    return SelectedState.INDETERMINATE;
  }

  @action.bound
  private onSelectAllCheckboxChanged() {
    this.selectedLayers =
      this.selectedState === SelectedState.INDETERMINATE || this.selectedState === SelectedState.CLEAR
        ? this.props.layers
        : [];

    this.props.onSelect(this.selectedLayers);
  }

  @action.bound
  private onSelectItemChanged([layer, enabled]: [CrgLayer, boolean]) {
    this.selectedLayers = enabled
      ? ([...this.selectedLayers, layer] as CrgLayer[])
      : this.selectedLayers.filter(item => item !== layer);

    this.props.onSelect(this.selectedLayers);
  }

  private isItemSelected(layer: CrgLayer) {
    return this.selectedLayers.includes(layer);
  }
}
