import React, { Component } from 'react';
import { action, observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { PropertySchema, PropertyType } from '../../services/data/schema/schema.models';
import { ChooseXTableDialog } from '../ChooseXTableDialog/ChooseXTableDialog';
import { FormControlProps } from '../Form/Control/Form-Control';
import { Button } from '../Button/Button';

const cnSelectColsControl = cn('SelectColsControl');

@observer
export default class SelectColsControl extends Component<FormControlProps> {
  @observable private dialogOpen = false;

  constructor(props: FormControlProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { property } = this.props;

    if (property.propertyType !== PropertyType.CUSTOM) {
      throw new Error('Ошибка: не тот тип поля');
    }

    const properties = property.properties as PropertySchema[];

    return (
      <>
        <Button className={cnSelectColsControl()} onClick={this.openDialog}>
          Выбрать колонки
        </Button>

        <ChooseXTableDialog
          title='Выберите отображаемые столбцы'
          data={properties}
          selectedItems={properties.filter(Boolean)}
          cols={[{ title: 'Название', field: 'title', filterable: true }]}
          open={this.dialogOpen}
          onClose={this.closeDialog}
          onSelect={this.onSelect}
          getRowId={this.getRowId}
        />
      </>
    );
  }

  @action.bound
  private onSelect(items: PropertySchema[]): void {
    const { onChange, property } = this.props;

    if (property.propertyType !== PropertyType.CUSTOM) {
      throw new Error('Ошибка: не тот тип поля');
    }

    const properties = property.properties as PropertySchema[];

    if (onChange) {
      onChange({
        value: properties.filter(({ name }) => items.some(item => item.name === name)),
        propertyName: property.name
      });
    }

    this.closeDialog();
  }

  private getRowId(rowData: PropertySchema) {
    return rowData.name;
  }

  @action.bound
  private openDialog() {
    this.dialogOpen = true;
  }

  @action.bound
  private closeDialog() {
    this.dialogOpen = false;
  }
}
