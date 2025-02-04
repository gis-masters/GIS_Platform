import React, { Component } from 'react';
import { action, computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Check, Close } from '@mui/icons-material';
import { withBemMod } from '@bem-react/core';

import { PropertyType } from '../../../../services/data/schema/schema.models';
import { getFieldFilterValue, modifyFieldFilterValue } from '../../../../services/util/filters/filters';
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
  private get value(): boolean | null {
    const { filterQuery, field } = this.props;
    const value = getFieldFilterValue(filterQuery, field);

    return value === undefined ? null : value === true;
  }

  @action.bound
  private handleChange(e: React.MouseEvent<HTMLElement, MouseEvent>, value: boolean) {
    const { field, filterQuery, onBeforeFilterChange, onFilterChange } = this.props;

    onBeforeFilterChange();

    modifyFieldFilterValue(filterQuery, field, value === null ? undefined : value || { $in: [null, false] });

    onFilterChange();
  }
}

export const withTypeBool = withBemMod<XTableFilterProps, XTableFilterProps>(
  cnXTableFilter(),
  { type: PropertyType.BOOL },
  () => XTableFilterTypeBool
);
