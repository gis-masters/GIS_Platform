import React, { Component } from 'react';
import { action, computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { TextField } from '@mui/material';
import { withBemMod } from '@bem-react/core';

import { PropertyType } from '../../../../services/data/schema/schema.models';
import { getFieldFilterValue, modifyFieldFilterValue } from '../../../../services/util/filters/filters';
import { FilterQuery } from '../../../../services/util/filters/filters.models';
import { XTableFilterStrictness } from '../../FilterStrictness/XTable-FilterStrictness';
import { cnXTableFilter, XTableFilterProps } from '../XTable-Filter.base';

import '!style-loader!css-loader!sass-loader!./XTable-Filter_type_string.scss';

@observer
class XTableFilterTypeString extends Component<XTableFilterProps> {
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
        InputProps={{
          endAdornment: (
            <XTableFilterStrictness
              onClick={this.toggleStrictFiltering}
              strict={this.strictFiltering}
              filtered={this.strictFiltering || !!this.value}
            />
          )
        }}
      />
    );
  }

  @computed
  private get value(): string {
    const { filterQuery, field } = this.props;
    const value = ((getFieldFilterValue(filterQuery, field) as FilterQuery)?.$ilike as string) || '';

    const clearedValue = value.replaceAll("''", "'");

    return this.strictFiltering ? clearedValue : clearedValue.replaceAll(/^%|%$/g, '');
  }

  @computed
  private get strictFiltering(): boolean {
    const { filterQuery, field } = this.props;
    const filter = getFieldFilterValue(filterQuery, field) as FilterQuery;
    const filterValue = filter?.$ilike || filter?.$in;

    return filterValue === undefined ? false : !/^%.*%$/.test(String(filterValue));
  }

  @action.bound
  private handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { field, filterQuery, onBeforeFilterChange, onFilterChange } = this.props;

    onBeforeFilterChange();

    if (e.target.value?.length) {
      const escapedValue = e.target.value.replaceAll("'", "''");

      modifyFieldFilterValue(
        filterQuery,
        field,
        this.strictFiltering ? { $ilike: escapedValue } : { $ilike: `%${escapedValue}%` }
      );
    } else if (this.strictFiltering) {
      modifyFieldFilterValue(filterQuery, field, { $in: ['', null] });
    } else {
      modifyFieldFilterValue(filterQuery, field);
    }

    onFilterChange();
  }

  @action.bound
  private toggleStrictFiltering() {
    const { field, filterQuery, onBeforeFilterChange, onFilterChange } = this.props;

    onBeforeFilterChange();

    const escapedValue = this.value.replaceAll("'", "''");

    if (this.value) {
      modifyFieldFilterValue(
        filterQuery,
        field,
        this.strictFiltering ? { $ilike: `%${escapedValue}%` } : { $ilike: escapedValue }
      );
    } else if (this.strictFiltering) {
      modifyFieldFilterValue(filterQuery, field);
    } else {
      modifyFieldFilterValue(filterQuery, field, { $in: ['', null] });
    }

    onFilterChange();
  }
}

export const withTypeString = withBemMod<XTableFilterProps, XTableFilterProps>(
  cnXTableFilter(),
  { type: PropertyType.STRING },
  () => XTableFilterTypeString
);
