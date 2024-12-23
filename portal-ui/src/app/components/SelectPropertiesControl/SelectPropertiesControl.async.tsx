import React, { Component } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { isObject } from 'lodash';

import {
  isPropertySchema,
  isPropertySchemaArray,
  PropertiesAfterValidation,
  PropertySchema,
  PropertyType
} from '../../services/data/schema/schema.models';
import { Button } from '../Button/Button';
import { ChooseXTableDialog } from '../ChooseXTableDialog/ChooseXTableDialog';
import { FormControlProps } from '../Form/Control/Form-Control';

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
    const { fieldValue } = this.props;

    const { validProperties, invalidProperties } = this.propertiesAfterValidation;

    invalidProperties.forEach(prop => {
      let propertyTitle = 'UNKNOWN';

      if (isObject(prop) && 'title' in prop && typeof prop.title === 'string') {
        propertyTitle = prop.title;
      } else if (isObject(prop) && 'name' in prop && typeof prop.name === 'string') {
        propertyTitle = prop.name;
      }
      console.warn(`Свойство c идентификатором ${propertyTitle} невалидно и не может быть напечатано`);
    });

    const selectedItems = Array.isArray(fieldValue) ? fieldValue : validProperties;

    return (
      <>
        <span className={cnSelectPropertiesControl('Label')}>
          выбрано {selectedItems.length} из {validProperties.length}
        </span>

        <Button className={cnSelectPropertiesControl()} onClick={this.openDialog}>
          Выбрать
        </Button>

        <ChooseXTableDialog
          title='Выберите отображаемые столбцы'
          data={validProperties}
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

  @computed
  private get propertiesAfterValidation(): PropertiesAfterValidation {
    const { property } = this.props;

    if (property.propertyType !== PropertyType.CUSTOM) {
      throw new Error('Ошибка: не тот тип поля');
    }

    const { properties } = property;

    if (!Array.isArray(properties)) {
      throw new TypeError('Ошибка: отсутствует обязательный параметр properties');
    }

    const validProperties: PropertySchema[] = [];
    const invalidProperties: unknown[] = [];

    for (const property of properties) {
      if (isPropertySchema(property)) {
        validProperties.push(property);
      } else {
        invalidProperties.push(property);
      }
    }

    return { validProperties, invalidProperties };
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
