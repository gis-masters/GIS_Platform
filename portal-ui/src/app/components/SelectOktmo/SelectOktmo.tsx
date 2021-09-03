import React, { Component } from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { PropertyEnumeration } from '../../services/crg/schema.models';

import { SortParams } from '../../services/util/sortObjects';
import { ChooseXTableDialog } from '../ChooseXTableDialog/ChooseXTableDialog';
import { FormControlProps } from '../Form/Control/Form-Control';
import { Button } from '../Button/Button';
import { oktmo } from '../ImportGml/oktmo';
import { XTableColumn } from '../XTable/XTable';

import { SelectOktmoCaption } from './Caption/SelectOktmo-Caption';

import '!style-loader!css-loader!sass-loader!./SelectOktmo.scss';

const cnSelectOktmo = cn('SelectOktmo');

@observer
export class SelectOktmo extends Component<FormControlProps> {
  @observable private dialogOpen = false;

  private cols: XTableColumn<PropertyEnumeration>[] = [
    {
      field: 'title',
      title: 'Название населённого пункта',
      filtering: true,
      sorting: true
    },
    {
      field: 'value',
      title: 'ОКТМО',
      filtering: true,
      sorting: true
    }
  ];

  private sortParams: SortParams<PropertyEnumeration> = { asc: true, field: 'title' };

  render() {
    const value = this.props.fieldValue as string;
    const selectedItem = oktmo.find(item => item.value === value);

    return (
      <>
        <div className={cnSelectOktmo()}>
          <SelectOktmoCaption item={selectedItem} />
          <Button onClick={this.openDialog}>Выбрать</Button>
        </div>
        <ChooseXTableDialog<PropertyEnumeration>
          title='Выбор ОКТМО'
          items={oktmo}
          selectedItems={selectedItem && [selectedItem]}
          cols={this.cols}
          defaultSort={this.sortParams}
          secondarySortField='value'
          open={this.dialogOpen}
          onClose={this.closeDialog}
          onSelect={this.select}
          getRowId={this.getItemId}
          single
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
  private select([item]: PropertyEnumeration[]) {
    const { onChange, property } = this.props;
    onChange({ value: item.value, propertyName: property.name });
    this.closeDialog();
  }

  private getItemId({ value }: PropertyEnumeration): string {
    return String(value);
  }
}
