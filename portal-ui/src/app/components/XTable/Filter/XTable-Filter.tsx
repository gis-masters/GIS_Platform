import React, { Component } from 'react';
import { action, computed } from 'mobx';
import { observer } from 'mobx-react';
import { TextField } from '@mui/material';
import { IClassNameProps } from '@bem-react/core';
import { cn } from '@bem-react/classname';

import { PropertyOption, PropertyType } from '../../../services/crg/schema.models';
import { FilterQuery } from '../../../services/util/filterObjects';

import '!style-loader!css-loader!sass-loader!./XTable-Filter.scss';

export const cnXTableFilter = cn('XTable', 'Filter');

export enum FilterType {
  CHOICE = PropertyType.CHOICE,
  DATETIME = PropertyType.DATETIME,
  FLOAT = PropertyType.FLOAT,
  STRING = PropertyType.STRING
}

export interface XTableFilterProps extends IClassNameProps {
  field: string;
  filterQuery: FilterQuery;
  type: FilterType;
  filterOptions: PropertyOption[];
  onBeforeFilterChange: () => void;
  onFilterChange: () => void;
}

@observer
export class XTableFilter extends Component<XTableFilterProps> {
  render() {
    const { type } = this.props;

    return (
      <TextField
        variant='filled'
        size='small'
        className={cnXTableFilter({ type })}
        onChange={this.handleChange}
        value={this.value}
      />
    );
  }

  @computed
  private get value(): string {
    const { filterQuery, field, type = FilterType.STRING } = this.props;

    if (type === FilterType.STRING) {
      return (((filterQuery[field] as FilterQuery)?.$ilike as string) || '').replace(/^%|%$/g, '');
    }

    return String(filterQuery[field] || '');
  }

  @action.bound
  private handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { field, filterQuery, type = FilterType.STRING, onBeforeFilterChange, onFilterChange } = this.props;

    onBeforeFilterChange();

    if (e.target.value?.length) {
      if (type === FilterType.STRING) {
        filterQuery[field] = { $ilike: `%${e.target.value}%` };
      } else {
        filterQuery[field] = e.target.value;
      }
    } else {
      delete filterQuery[field];
    }

    onFilterChange();
  }
}
