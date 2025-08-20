import React, { Component } from 'react';
import { action, computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { TextField } from '@mui/material';
import { withBemMod } from '@bem-react/core';

import { PropertyType } from '../../../../services/data/schema/schema.models';
import { getFieldFilterValue, modifyFieldFilterValue } from '../../../../services/util/filters/filters';
import { FilterQuery } from '../../../../services/util/filters/filters.models';
import { cnXTableFilter, XTableFilterProps } from '../XTable-Filter.base';

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
    const value = getFieldFilterValue(filterQuery, field);

    return ((value as FilterQuery)?.$gte as string) || '';
  }

  @computed
  private get to(): string {
    const { filterQuery, field } = this.props;
    const value = getFieldFilterValue(filterQuery, field);

    return ((value as FilterQuery)?.$lte as string) || '';
  }

  @action.bound
  private handleFromChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { field, filterQuery, onBeforeFilterChange, onFilterChange } = this.props;
    const currentValue = getFieldFilterValue(filterQuery, field) as { $lte: string; $gte: string };

    onBeforeFilterChange();

    if (e.target.value) {
      modifyFieldFilterValue(filterQuery, field, {
        ...currentValue,
        $gte: e.target.value
      });
    } else if (this.to) {
      modifyFieldFilterValue(filterQuery, field, { $lte: currentValue.$lte });
    } else {
      modifyFieldFilterValue(filterQuery, field);
    }

    onFilterChange();
  }

  @action.bound
  private handleToChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { field, filterQuery, onBeforeFilterChange, onFilterChange } = this.props;
    const currentValue = getFieldFilterValue(filterQuery, field) as { $lte: string; $gte: string };

    onBeforeFilterChange();

    if (e.target.value) {
      modifyFieldFilterValue(filterQuery, field, {
        ...currentValue,
        $lte: e.target.value
      });
    } else if (this.from) {
      modifyFieldFilterValue(filterQuery, field, { $gte: currentValue.$gte });
    } else {
      modifyFieldFilterValue(filterQuery, field);
    }

    onFilterChange();
  }
}

export const withTypeDateTime = withBemMod<XTableFilterProps, XTableFilterProps>(
  cnXTableFilter(),
  { type: PropertyType.DATETIME },
  () => XTableFilterTypeDateTime
);
