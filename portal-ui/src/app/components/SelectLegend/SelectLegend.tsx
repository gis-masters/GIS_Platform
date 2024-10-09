import React, { Component } from 'react';
import { action, IReactionDisposer, makeObservable, observable, reaction } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { StyleRuleExtended } from '../../services/geoserver/styles/styles.models';
import { loadAllLayersStyles } from '../../services/map/map-print.service';
import { SortParams } from '../../services/util/sortObjects';
import { currentProject } from '../../stores/CurrentProject.store';
import { printSettings } from '../../stores/PrintSettings.store';
import { Button } from '../Button/Button';
import { ChooseXTableDialog } from '../ChooseXTableDialog/ChooseXTableDialog';
import { FormControlProps } from '../Form/Control/Form-Control';
import { XTableColumn } from '../XTable/XTable.models';
import { SelectLegendCount } from './Count/SelectLegend-Count';
import { SelectLegendImg } from './Img/SelectLegend-Img';

import '!style-loader!css-loader!sass-loader!./SelectLegend.scss';

const cnSelectLegend = cn('SelectLegend');

@observer
export class SelectLegend extends Component<FormControlProps> {
  private disposer?: IReactionDisposer;
  @observable private dialogOpen = false;

  private cols: XTableColumn<StyleRuleExtended>[] = [
    {
      title: 'Знак',
      CellContent: SelectLegendImg
    },
    {
      field: 'title',
      title: 'Название',
      filterable: true,
      sortable: true
    },
    {
      field: 'layerTitle',
      title: 'Слой',
      filterable: true,
      sortable: true
    }
  ];

  private sortParams: SortParams<StyleRuleExtended> = { asc: true, field: 'layerTitle' };

  constructor(props: FormControlProps) {
    super(props);
    makeObservable(this);
  }

  componentDidMount() {
    this.disposer = reaction(
      () => currentProject.visibleVectorLayers,
      async () => {
        await loadAllLayersStyles();
      },
      { fireImmediately: true }
    );
  }

  componentWillUnmount() {
    this.disposer?.();
  }

  render() {
    return (
      <>
        <div className={cnSelectLegend()}>
          <Button onClick={this.openDialog}>Выбрать</Button>
          <SelectLegendCount />
        </div>
        <ChooseXTableDialog<StyleRuleExtended>
          title='Выбор знаков легенды'
          data={printSettings.allLegend}
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

  @action.bound
  private openDialog() {
    this.dialogOpen = true;
  }

  @action.bound
  private closeDialog() {
    this.dialogOpen = false;
  }

  @action.bound
  private select(items: StyleRuleExtended[]) {
    printSettings.legend.auto = false;
    printSettings.legend.items = items;
    this.closeDialog();
  }

  private getItemId({ name, layerId }: StyleRuleExtended): string {
    return `${name}:${layerId}`;
  }
}
