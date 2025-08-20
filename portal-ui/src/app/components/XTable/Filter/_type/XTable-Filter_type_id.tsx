import React, { Component } from 'react';
import { action, computed, IReactionDisposer, makeObservable, observable, reaction } from 'mobx';
import { observer } from 'mobx-react';
import { TextField } from '@mui/material';
import { withBemMod } from '@bem-react/core';

import { getFieldFilterValue, modifyFieldFilterValue } from '../../../../services/util/filters/filters';
import { FilterQuery } from '../../../../services/util/filters/filters.models';
import { notFalsyFilter } from '../../../../services/util/NotFalsyFilter';
import { XTableExtraColumnType } from '../../XTable.models';
import { cnXTableFilter, XTableFilterProps } from '../XTable-Filter.base';

import '!style-loader!css-loader!sass-loader!./XTable-Filter_type_id.scss';

@observer
class XTableFilterTypeId extends Component<XTableFilterProps> {
  @observable private currentInput = '';
  private reactionDisposer?: IReactionDisposer;

  constructor(props: XTableFilterProps) {
    super(props);
    makeObservable(this);
  }

  componentDidMount() {
    const { field, filterQuery } = this.props;

    this.reactionDisposer = reaction(
      () => getFieldFilterValue(filterQuery, field),
      fieldFilter => {
        if (!fieldFilter) {
          this.setCurrentInput('');
        }
      }
    );
  }

  componentWillUnmount() {
    this.reactionDisposer?.();
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

    return (
      this.currentInput || ((getFieldFilterValue(filterQuery, field) as FilterQuery)?.$in as number[])?.join(', ') || ''
    );
  }

  @action.bound
  private handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { field, filterQuery, onBeforeFilterChange, onFilterChange } = this.props;

    this.setCurrentInput(e.target.value.replaceAll(/[^\d ,]/g, ''));
    const value: number[] = this.currentInput.replaceAll(/\D+/g, ',').split(',').filter(notFalsyFilter).map(Number);

    onBeforeFilterChange();

    if (value?.length) {
      modifyFieldFilterValue(filterQuery, field, { $in: value });
    } else {
      modifyFieldFilterValue(filterQuery, field);
    }

    onFilterChange();
  }

  @action
  private setCurrentInput(currentInput: string) {
    this.currentInput = currentInput;
  }
}

export const withTypeId = withBemMod<XTableFilterProps, XTableFilterProps>(
  cnXTableFilter(),
  { type: XTableExtraColumnType.ID },
  () => XTableFilterTypeId
);
