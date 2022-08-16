import React, { Component } from 'react';
import { action, computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { TextField } from '@mui/material';
import { withBemMod } from '@bem-react/core';

import { PropertyType } from '../../../../services/data/schema.models';
import { FilterQuery } from '../../../../services/util/filterObjects';

import { cnXTableFilter, XTableFilterProps } from '../XTable-Filter.base';
import { XTableFilterStrictness } from '../../FilterStrictness/XTable-FilterStrictness';

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
      <>
        <TextField
          variant='filled'
          size='small'
          className={cnXTableFilter(null, [className])}
          onChange={this.handleChange}
          value={this.value}
        />

        <XTableFilterStrictness
          onClick={this.toggleStrictFiltering}
          strict={this.strictFiltering}
          filtered={this.strictFiltering || !!this.value}
        />
      </>
    );
  }

  @computed
  private get value(): string {
    const { filterQuery, field } = this.props;
    const value = ((filterQuery[field] as FilterQuery)?.$ilike as string) || '';

    return this.strictFiltering ? value : value.replace(/^%|%$/g, '');
  }

  @computed
  private get strictFiltering(): boolean {
    const filter = this.props.filterQuery[this.props.field] as FilterQuery;
    const filterValue = filter?.$ilike || filter?.$in;

    return filterValue === undefined ? false : !/^%.*%$/.test(String(filterValue));
  }

  @action.bound
  private handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { field, filterQuery, onBeforeFilterChange, onFilterChange } = this.props;

    onBeforeFilterChange();

    if (e.target.value?.length) {
      filterQuery[field] = this.strictFiltering ? { $ilike: e.target.value } : { $ilike: `%${e.target.value}%` };
    } else if (this.strictFiltering) {
      filterQuery[field] = { $in: ['', null] };
    } else {
      delete filterQuery[field];
    }

    onFilterChange();
  }

  @action.bound
  private toggleStrictFiltering() {
    const { field, filterQuery, onBeforeFilterChange, onFilterChange } = this.props;

    onBeforeFilterChange();
    if (!this.value) {
      if (this.strictFiltering) {
        delete filterQuery[field];
      } else {
        filterQuery[field] = { $in: ['', null] };
      }
    } else {
      filterQuery[field] = this.strictFiltering ? { $ilike: `%${this.value}%` } : { $ilike: this.value };
    }

    onFilterChange();
  }
}

export const withTypeString = withBemMod<XTableFilterProps, XTableFilterProps>(
  cnXTableFilter(),
  { type: PropertyType.STRING },
  () => XTableFilterTypeString
);
