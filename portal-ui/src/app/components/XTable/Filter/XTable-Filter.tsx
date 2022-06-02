import React, { Component } from 'react';
import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import { TextField } from '@mui/material';
import { IClassNameProps } from '@bem-react/core';
import { cn } from '@bem-react/classname';

import { PropertyOption, PropertyType } from '../../../services/crg/schema.models';
import { FilterQuery } from '../../../services/util/filterObjects';

import { XTableFilterType } from '../FilterType/XTable-FilterType';

import '!style-loader!css-loader!sass-loader!./XTable-Filter.scss';

export const cnXTableFilter = cn('XTable', 'Filter');

export enum FilterType {
  BOOL = PropertyType.BOOL,
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
  @observable private strictFiltering = false;

  componentDidMount() {
    const filter = this.props.filterQuery[this.props.field] as FilterQuery;
    const filterValue = filter?.$ilike || filter?.$in;

    if (filterValue === undefined) {
      this.setStrictFiltering(false);
    } else {
      this.setStrictFiltering(!/^%.*%$/.test(String(filterValue)));
    }
  }

  render() {
    const { type } = this.props;

    return (
      <>
        <TextField
          variant='filled'
          size='small'
          className={cnXTableFilter({ type })}
          onChange={this.handleChange}
          value={this.value}
        />

        {type === FilterType.STRING && (
          <XTableFilterType
            onClick={this.toggleStrictFiltering}
            strictFiltering={this.strictFiltering}
            filtered={this.strictFiltering || !!this.value}
          />
        )}
      </>
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
        filterQuery[field] = this.strictFiltering ? { $ilike: e.target.value } : { $ilike: `%${e.target.value}%` };
      } else {
        filterQuery[field] = e.target.value;
      }
    } else if (this.strictFiltering) {
      filterQuery[field] = { $in: ['', null] };
    } else {
      delete filterQuery[field];
    }

    onFilterChange();
  }

  @action.bound
  private setStrictFiltering(strictFiltering: boolean) {
    this.strictFiltering = strictFiltering;
  }

  @action.bound
  private toggleStrictFiltering() {
    this.setStrictFiltering(!this.strictFiltering);

    const { field, filterQuery, onBeforeFilterChange, onFilterChange } = this.props;

    onBeforeFilterChange();
    if (!this.value) {
      if (this.strictFiltering) {
        filterQuery[field] = { $in: ['', null] };
      } else {
        delete filterQuery[field];
      }
    } else {
      filterQuery[field] = this.strictFiltering ? { $ilike: this.value } : { $ilike: `%${this.value}%` };
    }

    onFilterChange();
  }
}
