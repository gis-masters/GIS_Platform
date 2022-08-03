import React, { Component } from 'react';
import { action, computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { TextField } from '@mui/material';
import { withBemMod } from '@bem-react/core';

import { FilterQuery } from '../../../../services/util/filterObjects';
import { PropertyType } from '../../../../services/data/schema.models';

import { cnXTableFilter, XTableFilterProps } from '../XTable-Filter';

import '!style-loader!css-loader!sass-loader!./XTable-Filter_type_dateTime.scss';

@observer
class XTableFilterTypeDateTime extends Component<XTableFilterProps> {
  constructor(props: XTableFilterProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { className } = this.props;

    return (
      <span className={cnXTableFilter(null, [className])}>
        <TextField
          variant='filled'
          size='small'
          onChange={this.handleFromChange}
          value={this.from}
          placeholder='от'
          type='date'
        />
        <TextField
          variant='filled'
          size='small'
          onChange={this.handleToChange}
          value={this.to}
          placeholder='до'
          type='date'
        />
      </span>
    );
  }

  @computed
  private get from(): string {
    const { filterQuery, field } = this.props;

    return ((filterQuery[field] as FilterQuery)?.$gte as string) || '';
  }

  @computed
  private get to(): string {
    const { filterQuery, field } = this.props;

    return ((filterQuery[field] as FilterQuery)?.$lte as string) || '';
  }

  @action.bound
  private handleFromChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { field, filterQuery, onBeforeFilterChange, onFilterChange } = this.props;

    onBeforeFilterChange();

    if (e.target.value) {
      filterQuery[field] = {
        ...(filterQuery[field] as { $lte: string; $gte: string }),
        $gte: e.target.value
      };
    } else if (this.to) {
      filterQuery[field] = { $lte: (filterQuery[field] as { $lte: string }).$lte };
    } else {
      delete filterQuery[field];
    }

    onFilterChange();
  }

  @action.bound
  private handleToChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { field, filterQuery, onBeforeFilterChange, onFilterChange } = this.props;

    onBeforeFilterChange();

    if (e.target.value) {
      filterQuery[field] = {
        ...(filterQuery[field] as { $lte: string; $gte: string }),
        $lte: e.target.value
      };
    } else if (this.from) {
      filterQuery[field] = { $gte: (filterQuery[field] as { $gte: string }).$gte };
    } else {
      delete filterQuery[field];
    }

    onFilterChange();
  }
}

export const withTypeDateTime = withBemMod<XTableFilterProps, XTableFilterProps>(
  cnXTableFilter(),
  { type: PropertyType.DATETIME },
  () => XTableFilterTypeDateTime
);
