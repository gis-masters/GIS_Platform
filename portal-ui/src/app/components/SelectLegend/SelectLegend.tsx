import React, { Component } from 'react';
import { action, computed, IReactionDisposer, observable, reaction } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { currentProject } from '../../stores/CurrentProject.store';
import { printSettings, RuleExtended } from '../../stores/PrintSettings.store';
import { SortParams } from '../../services/util/sortObjects';
import { loadLayerLegend } from '../../services/geoserver/layers.service';
import { ChooseXTableDialog } from '../ChooseXTableDialog/ChooseXTableDialog';
import { FormControlProps } from '../Form/Control/Form-Control';
import { Button } from '../Button/Button';
import { XTableColumn } from '../XTable/XTable';

import { SelectLegendImg } from './Img/SelectLegend-Img';
import { SelectLegendCount } from './Count/SelectLegend-Count';

import '!style-loader!css-loader!sass-loader!./SelectLegend.scss';

const cnSelectLegend = cn('SelectLegend');

@observer
export class SelectLegend extends Component<FormControlProps> {
  private disposer: IReactionDisposer;
  @observable private dialogOpen = false;

  private cols: XTableColumn<RuleExtended>[] = [
    {
      title: 'Знак',
      CellContent: SelectLegendImg
    },
    {
      field: 'title',
      title: 'Название',
      filtering: true,
      sorting: true
    },
    {
      field: 'layerTitle',
      title: 'Слой',
      filtering: true,
      sorting: true
    }
  ];

  private sortParams: SortParams<RuleExtended> = { asc: true, field: 'layerTitle' };

  componentDidMount() {
    this.disposer = reaction(
      () => currentProject.visibleLayersWithoutRasters,
      async () => {
        for (const { payload: layer } of currentProject.visibleLayersWithoutRasters) {
          if (!layer.legend && !layer.legendIsFetching) {
            await loadLayerLegend(layer);
          }
        }
      }
    );
  }

  componentWillUnmount() {
    this.disposer();
  }

  render() {
    return (
      <>
        <div className={cnSelectLegend()}>
          <Button onClick={this.openDialog}>Выбрать</Button>
          <SelectLegendCount />
        </div>
        <ChooseXTableDialog<RuleExtended>
          title='Выбор знаков легенды'
          items={this.legend}
          selectedItems={printSettings.legend.items}
          cols={this.cols}
          defaultSort={this.sortParams}
          secondarySortField='title'
          open={this.dialogOpen}
          onClose={this.closeDialog}
          onSelect={this.select}
          getRowId={this.getItemId}
        />
      </>
    );
  }

  @computed
  private get legend(): RuleExtended[] {
    return currentProject.visibleLayersWithoutRasters.flatMap(({ payload }) =>
      (payload.legend || []).map(rule => ({ ...rule, layerId: payload.id, layerTitle: payload.title }))
    );
  }

  @action.bound
  private openDialog() {
    this.dialogOpen = true;
  }

  @action.bound
  private closeDialog() {
    this.dialogOpen = false;
  }

  @action.bound
  private select(items: RuleExtended[]) {
    printSettings.legend.items = items;
    this.closeDialog();
  }

  private getItemId({ name, layerId }: RuleExtended): string {
    return `${name}:${layerId}`;
  }
}
