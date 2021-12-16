import React, { Component } from 'react';
import { action, computed } from 'mobx';
import { observer } from 'mobx-react';
import { TextField } from '@mui/material';
import { withBemMod } from '@bem-react/core';

import { FilterQuery } from '../../../../services/util/filterObjects';

import { cnXTableFilter, FilterType, XTableFilterProps } from '../XTable-Filter';

import '!style-loader!css-loader!sass-loader!./XTable-Filter_type_float.scss';

@observer
class XTableFilterTypeFloat extends Component<XTableFilterProps> {
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
          type='number'
        />
        <TextField
          variant='filled'
          size='small'
          onChange={this.handleToChange}
          value={this.to}
          placeholder='до'
          type='number'
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
    if (e.target.value?.length) {
      filterQuery[field] = {
        ...((filterQuery[field] as { $lte: number; $gte: number }) || {}),
        $gte: Number(e.target.value)
      };
    } else if (typeof this.to === 'number') {
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

    if (e.target.value?.length) {
      filterQuery[field] = {
        ...((filterQuery[field] as { $lte: number; $gte: number }) || {}),
        $lte: Number(e.target.value)
      };
    } else if (typeof this.from === 'number') {
      filterQuery[field] = { $gte: (filterQuery[field] as { $gte: string }).$gte };
    } else {
      delete filterQuery[field];
    }

    onFilterChange();
  }
}

export const withTypeFloat = withBemMod<XTableFilterProps, XTableFilterProps>(
  cnXTableFilter(),
  { type: FilterType.FLOAT },
  () => XTableFilterTypeFloat
);
