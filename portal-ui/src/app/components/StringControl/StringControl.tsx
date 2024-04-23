import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { PropertySchemaString, PropertyType } from '../../services/data/schema/schema.models';
import { FormControlProps } from '../Form/Control/Form-Control';
import { StringControlInner } from './Inner/StringControl-Inner.composed';

import '!style-loader!css-loader!sass-loader!./StringControl.scss';

const cnStringControl = cn('StringControl');

@observer
export class StringControl extends Component<FormControlProps> {
  render() {
    const {
      className,
      inSet,
      property,
      variant = 'standard',
      labelInField,
      fullWidthForOldForm,
      ...props
    } = this.props;
    if (property.propertyType !== PropertyType.STRING) {
      throw new Error('Ошибка: не string');
    }
    const { display } = property;

    return (
      <div className={cnStringControl({ inSet, fullWidthForOldForm, labelInField, display }, [className])}>
        <StringControlInner
          {...props}
          display={display}
          variant={variant}
          property={property}
          labelInField={labelInField}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
        />
      </div>
    );
  }

  @boundMethod
  private handleChange(value: string) {
    const { onChange, property } = this.props;
    const { display } = property as PropertySchemaString;

    if (onChange) {
      onChange({
        value: display === 'email' ? value.trim() : value,
        propertyName: property.name
      });
    }
  }

  @boundMethod
  private handleBlur() {
    const { onNeedValidate, fieldValue, property } = this.props;

    if (onNeedValidate) {
      onNeedValidate({
        value: fieldValue,
        propertyName: property.name
      });
    }
  }
}
