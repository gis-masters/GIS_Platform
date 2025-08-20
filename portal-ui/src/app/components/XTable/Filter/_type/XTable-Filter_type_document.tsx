import React, { Component } from 'react';
import { action, computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { TextField } from '@mui/material';
import { withBemMod } from '@bem-react/core';

import { PropertyType } from '../../../../services/data/schema/schema.models';
import { getFieldFilterValue, modifyFieldFilterValue } from '../../../../services/util/filters/filters';
import { FilterQuery } from '../../../../services/util/filters/filters.models';
import { cnXTableFilter, XTableFilterProps } from '../XTable-Filter.base';

import '!style-loader!css-loader!sass-loader!./XTable-Filter_type_document.scss';

@observer
class XTableFilterTypeDocument extends Component<XTableFilterProps> {
  constructor(props: XTableFilterProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { className } = this.props;

    return (
      <TextField
        variant='filled'
        size='small'
        className={cnXTableFilter(null, [className])}
        onChange={this.handleChange}
        value={this.value}
      />
    );
  }

  @computed
  private get value(): string {
    const { filterQuery, field } = this.props;
    const value = getFieldFilterValue(filterQuery, field);

    let clearedValue = ((value as FilterQuery)?.$ilike as string) || '';

    if (clearedValue) {
      clearedValue = clearedValue.replaceAll(/^%|%$/g, '').replaceAll("''", "'");
    }

    return clearedValue;
  }

  @action.bound
  private handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { field, filterQuery, onBeforeFilterChange, onFilterChange } = this.props;

    onBeforeFilterChange();
    const escapedValue = e.target.value.replaceAll("'", "''");

    modifyFieldFilterValue(filterQuery, field, e.target.value?.length ? { $ilike: `%${escapedValue}%` } : undefined);

    onFilterChange();
  }
}

export const withTypeDocument = withBemMod<XTableFilterProps, XTableFilterProps>(
  cnXTableFilter(),
  { type: PropertyType.DOCUMENT },
  () => XTableFilterTypeDocument
);
