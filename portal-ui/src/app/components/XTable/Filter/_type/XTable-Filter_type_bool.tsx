import React, { Component } from 'react';
import { action, computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Check, Close } from '@mui/icons-material';
import { withBemMod } from '@bem-react/core';

import { PropertyType } from '../../../../services/data/schema.models';

import { cnXTableFilter, XTableFilterProps } from '../XTable-Filter.base';

import '!style-loader!css-loader!sass-loader!./XTable-Filter_type_bool.scss';

@observer
class XTableFilterTypeBool extends Component<XTableFilterProps> {
  constructor(props: XTableFilterProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { className } = this.props;

    return (
      <ToggleButtonGroup
        value={this.value}
        exclusive
        className={cnXTableFilter(null, [className])}
        onChange={this.handleChange}
        size='small'
      >
        <ToggleButton value>
          <Check />
        </ToggleButton>
        <ToggleButton value={false}>
          <Close />
        </ToggleButton>
      </ToggleButtonGroup>
    );
  }

  @computed
  private get value(): boolean {
    const { filterQuery, field } = this.props;

    return filterQuery[field] ? filterQuery[field] === true : null;
  }

  @action.bound
  private handleChange(e: React.MouseEvent<HTMLElement, MouseEvent>, value: boolean) {
    const { field, filterQuery, onBeforeFilterChange, onFilterChange } = this.props;

    onBeforeFilterChange();

    if (filterQuery[field] === value || value === null) {
      delete filterQuery[field];
    } else {
      filterQuery[field] = value || { $in: [null, false] };
    }

    onFilterChange();
  }
}

export const withTypeBool = withBemMod<XTableFilterProps, XTableFilterProps>(
  cnXTableFilter(),
  { type: PropertyType.BOOL },
  () => XTableFilterTypeBool
);
