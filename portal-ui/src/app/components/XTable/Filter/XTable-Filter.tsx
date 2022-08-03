import React, { Component } from 'react';
import { action, computed, observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { TextField } from '@mui/material';
import { IClassNameProps } from '@bem-react/core';
import { cn } from '@bem-react/classname';

import { PropertyOption, PropertyType } from '../../../services/data/schema.models';
import { FilterQuery } from '../../../services/util/filterObjects';

import { XTableFilterStrictness } from '../FilterStrictness/XTable-FilterStrictness';

import '!style-loader!css-loader!sass-loader!./XTable-Filter.scss';

export const cnXTableFilter = cn('XTable', 'Filter');

export interface XTableFilterProps extends IClassNameProps {
  field: string;
  filterQuery: FilterQuery;
  type: PropertyType;
  options: PropertyOption[];
  onBeforeFilterChange: () => void;
  onFilterChange: () => void;
}

@observer
export class XTableFilter extends Component<XTableFilterProps> {
  @observable private strictFiltering = false;

  constructor(props: XTableFilterProps) {
    super(props);
    makeObservable(this);
  }

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

        {type === PropertyType.STRING && (
          <XTableFilterStrictness
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
    const { filterQuery, field, type = PropertyType.STRING } = this.props;

    if (type === PropertyType.STRING) {
      return (((filterQuery[field] as FilterQuery)?.$ilike as string) || '').replace(/^%|%$/g, '');
    }

    return String(filterQuery[field] || '');
  }

  @action.bound
  private handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { field, filterQuery, type = PropertyType.STRING, onBeforeFilterChange, onFilterChange } = this.props;

    onBeforeFilterChange();

    if (e.target.value?.length) {
      if (type === PropertyType.STRING) {
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
