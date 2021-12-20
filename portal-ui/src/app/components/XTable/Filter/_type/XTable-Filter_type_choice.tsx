import React, { Component } from 'react';
import { action, computed } from 'mobx';
import { observer } from 'mobx-react';
import { Checkbox, Divider, ListItemText, MenuItem, Select } from '@mui/material';
import { boundMethod } from 'autobind-decorator';
import { withBemMod } from '@bem-react/core';
import { isEqual } from 'lodash';

import { PropertyOption, PropertyType } from '../../../../services/crg/schema.models';
import { FilterQuery } from '../../../../services/util/filterObjects';

import { cnXTableFilter, XTableFilterProps } from '../XTable-Filter';

import '!style-loader!css-loader!sass-loader!./XTable-Filter_type_choice.scss';

const EMPTY = '~~~empty_value~~~';

@observer
class XTableFilterTypeChoice extends Component<XTableFilterProps> {
  render() {
    const { className } = this.props;

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
        <MenuItem value={this.options[0].value}>
          <Checkbox checked={this.value.includes(String(this.options[0].value))} />
          <ListItemText primary={this.options[0].title} />
        </MenuItem>
        <Divider />
        {this.options.slice(1).map((item, i) => (
          <MenuItem key={i} value={item.value}>
            <Checkbox checked={this.value.includes(String(item.value))} />
            <ListItemText primary={item.title} />
          </MenuItem>
        ))}
      </Select>
    );
  }

  @computed
  private get options(): PropertyOption[] {
    const { filterOptions = [] } = this.props;

    return [{ title: 'Не заполнено', value: EMPTY }, ...filterOptions];
  }

  @computed
  private get value(): string[] {
    const { filterQuery, field } = this.props;

    if ((filterQuery[field] as FilterQuery) === null) {
      return [EMPTY];
    }

    return ((filterQuery[field] as FilterQuery)?.$in as string[]) || [];
  }

  @action.bound
  private handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { field, filterQuery, onBeforeFilterChange, onFilterChange } = this.props;

    onBeforeFilterChange();

    if (Array.isArray(e.target.value) && e.target.value.length) {
      const val: string[] = e.target.value;

      if (e.target.value.includes(EMPTY) && !isEqual(this.value, [EMPTY])) {
        filterQuery[field] = null;
      } else {
        filterQuery[field] = { $in: val.filter(item => item !== EMPTY) };
      }
    } else {
      delete filterQuery[field];
    }

    onFilterChange();
  }

  @boundMethod
  private renderSelectValue(): string {
    return this.value.map(val => this.options.find(option => option.value === val)?.title || val).join(', ');
  }
}

export const withTypeChoice = withBemMod<XTableFilterProps, XTableFilterProps>(
  cnXTableFilter(),
  { type: PropertyType.CHOICE },
  () => XTableFilterTypeChoice
);
