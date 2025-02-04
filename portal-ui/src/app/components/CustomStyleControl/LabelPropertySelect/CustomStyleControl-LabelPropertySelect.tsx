import React, { Component } from 'react';
import { SelectChangeEvent } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { PropertyOption, PropertySchema, PropertyType, Schema } from '../../../services/data/schema/schema.models';
import { LABEL_PROPERTY_DEFAULT } from '../../../services/geoserver/styles/styles.models';
import { notFalsyFilter } from '../../../services/util/NotFalsyFilter';
import { Select } from '../../Select/Select';
import { CustomStyleControlLabel } from '../Label/CustomStyleControl-Label';
import { CustomStyleControlSubControl } from '../SubControl/CustomStyleControl-SubControl';

import '!style-loader!css-loader!sass-loader!./CustomStyleControl-LabelPropertySelect.scss';

const cnCustomStyleControlLabelPropertySelect = cn('CustomStyleControl', 'LabelPropertySelect');

interface CustomStyleControlLabelPropertySelectProps {
  label: string;
  schema: Schema;
  labelProperty?: PropertySchema;
  onChange?(propName: PropertySchema): void;
}

export class CustomStyleControlLabelPropertySelect extends Component<CustomStyleControlLabelPropertySelectProps> {
  render() {
    const { label, labelProperty } = this.props;

    return (
      <CustomStyleControlSubControl className={cnCustomStyleControlLabelPropertySelect()}>
        <CustomStyleControlLabel>{label}</CustomStyleControlLabel>
        <Select
          options={this.selectOptions}
          onChange={this.changeHandler}
          value={labelProperty?.name || LABEL_PROPERTY_DEFAULT.name}
        />
      </CustomStyleControlSubControl>
    );
  }

  @boundMethod
  private changeHandler(e: SelectChangeEvent<unknown>) {
    const { onChange, schema } = this.props;
    if (typeof e.target.value !== 'string') {
      throw new TypeError('Ошибка при выборе подписи');
    }

    let property = schema.properties.find(property => property.name === e.target.value);

    if (!property && e.target.value === LABEL_PROPERTY_DEFAULT.name) {
      property = LABEL_PROPERTY_DEFAULT;
    }

    if (onChange && property) {
      onChange(property);
    }
  }

  private get selectOptions(): PropertyOption[] {
    const noLabel = {
      title: LABEL_PROPERTY_DEFAULT.name,
      value: LABEL_PROPERTY_DEFAULT.name
    };

    if (!this.props.schema.properties) {
      return [noLabel];
    }

    const options: PropertyOption[] = this.props.schema.properties
      .map(property => {
        if (
          !property.hidden &&
          (property.propertyType === PropertyType.STRING ||
            property.propertyType === PropertyType.FLOAT ||
            property.propertyType === PropertyType.INT ||
            property.propertyType === PropertyType.DATETIME ||
            property.propertyType === PropertyType.CHOICE ||
            property.propertyType === PropertyType.FIAS)
        ) {
          return {
            title: property.title,
            value: property.name
          };
        }
      })
      .filter(notFalsyFilter);

    return [noLabel, ...options];
  }
}
