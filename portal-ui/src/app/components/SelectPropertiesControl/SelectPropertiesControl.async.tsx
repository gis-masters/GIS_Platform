import React, { Component } from 'react';
import { action, observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { PropertySchema, PropertyType, isPropertySchemaArray } from '../../services/data/schema/schema.models';
import { ChooseXTableDialog } from '../ChooseXTableDialog/ChooseXTableDialog';
import { FormControlProps } from '../Form/Control/Form-Control';
import { Button } from '../Button/Button';

import '!style-loader!css-loader!sass-loader!./SelectPropertiesControl.scss';

const cnSelectPropertiesControl = cn('SelectPropertiesControl');

@observer
export default class SelectPropertiesControl extends Component<FormControlProps> {
  @observable private dialogOpen = false;

  constructor(props: FormControlProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { property, fieldValue } = this.props;

    if (property.propertyType !== PropertyType.CUSTOM) {
      throw new Error('Ошибка: не тот тип поля');
    }

    const { properties } = property;

    if (!isPropertySchemaArray(properties)) {
      throw new Error('Ошибка: отсутствует обязательный параметр properties');
    }

    const selectedItems = Array.isArray(fieldValue) ? fieldValue : properties;

    return (
      <>
        <span className={cnSelectPropertiesControl('Label')}>
          выбрано {selectedItems.length} из {properties.length}
        </span>

        <Button className={cnSelectPropertiesControl()} onClick={this.openDialog}>
          Выбрать
        </Button>

        <ChooseXTableDialog
          title='Выберите отображаемые столбцы'
          data={properties}
          selectedItems={selectedItems}
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

    const { properties } = property;

    if (!isPropertySchemaArray(properties)) {
      throw new Error('Ошибка: отсутствует обязательный параметр properties');
    }

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
