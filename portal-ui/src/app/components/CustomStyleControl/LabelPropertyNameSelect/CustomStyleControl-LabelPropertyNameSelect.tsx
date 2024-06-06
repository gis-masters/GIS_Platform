import React, { Component } from 'react';
import { SelectChangeEvent } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { PropertyOption, Schema } from '../../../services/data/schema/schema.models';
import { LABEL_PROPERTY_NAME_DEFAULT } from '../../../services/geoserver/styles/styles.models';
import { notFalsyFilter } from '../../../services/util/NotFalsyFilter';
import { Select } from '../../Select/Select';
import { CustomStyleControlLabel } from '../Label/CustomStyleControl-Label';
import { CustomStyleControlSubControl } from '../SubControl/CustomStyleControl-SubControl';

import '!style-loader!css-loader!sass-loader!./CustomStyleControl-LabelPropertyNameSelect.scss';

const cnCustomStyleControlLabelPropertyNameSelect = cn('CustomStyleControl', 'LabelPropertyNameSelect');

interface CustomStyleControlLabelPropertyNameSelectProps {
  label: string;
  value?: string;
  schema: Schema;
  onChange?(propName: string): void;
}

export class CustomStyleControlLabelPropertyNameSelect
  extends Component<CustomStyleControlLabelPropertyNameSelectProps> {
  render() {
    const { label, value } = this.props;

    return (
      <CustomStyleControlSubControl className={cnCustomStyleControlLabelPropertyNameSelect()}>
        <CustomStyleControlLabel>{label}</CustomStyleControlLabel>
        <Select
          options={this.selectOptions}
          onChange={this.changeHandler}
          value={value || LABEL_PROPERTY_NAME_DEFAULT}
        />
      </CustomStyleControlSubControl>
    );
  }

  @boundMethod
  private changeHandler(e: SelectChangeEvent<unknown>) {
    if (typeof e.target.value !== 'string') {
      throw new TypeError('Ошибка при выборе подписи');
    }

    const propName = e.target.value;
    if (this.props.onChange) {
      this.props.onChange(propName);
    }
  }

  private get selectOptions(): PropertyOption[] {
    const noLabel = {
      title: LABEL_PROPERTY_NAME_DEFAULT,
      value: LABEL_PROPERTY_NAME_DEFAULT
    };

    if (!this.props.schema.properties) {
      return [noLabel];
    }

    const options: PropertyOption[] = this.props.schema.properties
      .map(property => {
        if (!property.hidden) {
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
