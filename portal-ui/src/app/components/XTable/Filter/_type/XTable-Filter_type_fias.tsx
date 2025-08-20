import React, { Component } from 'react';
import { action, computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { TextField } from '@mui/material';
import { withBemMod } from '@bem-react/core';

import { PropertyType } from '../../../../services/data/schema/schema.models';
import { getFieldFilterValue, modifyFieldFilterValue } from '../../../../services/util/filters/filters';
import { FilterQuery } from '../../../../services/util/filters/filters.models';
import { cnXTableFilter, XTableFilterProps } from '../XTable-Filter.base';

import '!style-loader!css-loader!sass-loader!./XTable-Filter_type_fias.scss';

@observer
class XTableFilterTypeFias extends Component<XTableFilterProps> {
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

    const value = ((getFieldFilterValue(filterQuery, field) as FilterQuery)?.$ilike as string) || '';

    return value.replaceAll(/^%|%$/g, '');
  }

  @action.bound
  private handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { field, filterQuery, onBeforeFilterChange, onFilterChange } = this.props;

    onBeforeFilterChange();

    if (e.target.value?.length) {
      modifyFieldFilterValue(filterQuery, field, { $ilike: `%${e.target.value}%` });
    } else {
      modifyFieldFilterValue(filterQuery, field);
    }

    onFilterChange();
  }
}

export const withTypeFias = withBemMod<XTableFilterProps, XTableFilterProps>(
  cnXTableFilter(),
  { type: PropertyType.FIAS },
  () => XTableFilterTypeFias
);
