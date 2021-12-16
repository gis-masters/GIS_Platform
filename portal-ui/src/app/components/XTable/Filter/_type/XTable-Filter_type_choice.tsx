import React, { Component } from 'react';
import { action, computed } from 'mobx';
import { observer } from 'mobx-react';
import { Checkbox, ListItemText, MenuItem, Select } from '@mui/material';
import { boundMethod } from 'autobind-decorator';
import { withBemMod } from '@bem-react/core';

import { PropertyType } from '../../../../services/crg/schema.models';
import { FilterQuery } from '../../../../services/util/filterObjects';

import { cnXTableFilter, XTableFilterProps } from '../XTable-Filter';

import '!style-loader!css-loader!sass-loader!./XTable-Filter_type_choice.scss';

@observer
class XTableFilterTypeChoice extends Component<XTableFilterProps> {
  render() {
    const { filterOptions = [], className } = this.props;

    return (
      <Select
        className={cnXTableFilter(null, [className])}
        onChange={this.handleChange}
        value={this.value}
        renderValue={this.renderSelectValue}
        fullWidth
        multiple
        variant='filled'
        size='small'
      >
        {filterOptions.map((item, i) => (
          <MenuItem key={i} value={item.value}>
            <Checkbox checked={this.value.includes(String(item.value))} />
            <ListItemText primary={item.title} />
          </MenuItem>
        ))}
      </Select>
    );
  }

  @computed
  private get value(): string[] {
    const { filterQuery, field } = this.props;

    return ((filterQuery[field] as FilterQuery)?.$in as string[]) || [];
  }

  @action.bound
  private handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { field, filterQuery, onBeforeFilterChange, onFilterChange } = this.props;
    onBeforeFilterChange();
    if (e.target.value?.length) {
      filterQuery[field] = { $in: e.target.value };
    } else {
      delete filterQuery[field];
    }
    onFilterChange();
  }

  @boundMethod
  private renderSelectValue(): string {
    const { filterOptions = [] } = this.props;

    return this.value.map(val => filterOptions.find(option => option.value === val)?.title || val).join(', ');
  }
}

export const withTypeChoice = withBemMod<XTableFilterProps, XTableFilterProps>(
  cnXTableFilter(),
  { type: PropertyType.CHOICE },
  () => XTableFilterTypeChoice
);
