import React, { Component } from 'react';
import { action, computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { TextField } from '@mui/material';

import { FilterQuery } from '../../../services/util/filterObjects';

import { cnXTableFilter, XTableFilterProps } from '../Filter/XTable-Filter.base';

@observer
export class XTableNumberFilter extends Component<XTableFilterProps> {
  constructor(props: XTableFilterProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { className } = this.props;

    return (
      <span className={cnXTableFilter(null, [className])}>
        <TextField variant='filled' size='small' onChange={this.handleFromChange} value={this.equal} type='number' />
      </span>
    );
  }

  @computed
  private get equal(): string {
    const { filterQuery, field } = this.props;

    return ((filterQuery[field] as FilterQuery)?.$eq as string) || '';
  }

  @action.bound
  private handleFromChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { field, filterQuery, onBeforeFilterChange, onFilterChange } = this.props;

    onBeforeFilterChange();
    if (e.target.value?.length) {
      filterQuery[field] = {
        ...(filterQuery[field] as { $eq: number }),
        $eq: Number(e.target.value)
      };
    } else if (typeof this.equal === 'number') {
      filterQuery[field] = { $eq: (filterQuery[field] as { $eq: string }).$eq };
    } else {
      delete filterQuery[field];
    }

    onFilterChange();
  }
}
