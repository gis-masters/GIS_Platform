import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { PropertySchemaString, PropertyType } from '../../services/data/schema/schema.models';
import { FormControlProps } from '../Form/Control/Form-Control';
import { StringControlInner } from '../StringControl/Inner/StringControl-Inner.composed';

import '!style-loader!css-loader!sass-loader!./TextControl.scss';

const cnTextControl = cn('TextControl');

@observer
export class TextControl extends Component<FormControlProps> {
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
    if (property.propertyType !== PropertyType.TEXT) {
      throw new Error('Ошибка: не text');
    }

    return (
      <div className={cnTextControl({ inSet, fullWidthForOldForm, labelInField }, [className])}>
        <StringControlInner
          {...props}
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
