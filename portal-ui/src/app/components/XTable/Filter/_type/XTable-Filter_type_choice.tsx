import React, { Component } from 'react';
import { action, computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Checkbox, Divider, ListItemText, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { cn } from '@bem-react/classname';
import { withBemMod } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';
import { isEqual } from 'lodash';

import { PropertyOption, PropertyType } from '../../../../services/data/schema/schema.models';
import { getFieldFilterValue, modifyFieldFilterValue } from '../../../../services/util/filters/filters';
import { FilterQuery } from '../../../../services/util/filters/filters.models';
import { cnXTableFilter, XTableFilterProps } from '../XTable-Filter.base';

import '!style-loader!css-loader!sass-loader!./XTable-Filter_type_choice.scss';

const cnXTableChoiceFilterPopover = cn('XTable', 'ChoiceFilterPopover');

const EMPTY = '~~~empty_value~~~';

@observer
class XTableFilterTypeChoice extends Component<XTableFilterProps> {
  constructor(props: XTableFilterProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { className } = this.props;

    return (
      <Select
        className={cnXTableFilter(null, [className])}
        MenuProps={{ PaperProps: { className: cnXTableChoiceFilterPopover() } }}
        onChange={this.handleChange}
        value={this.value}
        renderValue={this.renderSelectValue}
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
    const { options = [] } = this.props;

    return [{ title: 'Не заполнено', value: EMPTY }, ...options];
  }

  @computed
  private get value(): string[] {
    const { filterQuery, field } = this.props;
    const value = getFieldFilterValue(filterQuery, field);

    if (value === null) {
      return [EMPTY];
    }

    return ((value as FilterQuery)?.$in as string[]) || [];
  }

  @action.bound
  private handleChange(e: SelectChangeEvent<string[]>) {
    const { field, filterQuery, onBeforeFilterChange, onFilterChange } = this.props;

    onBeforeFilterChange();

    const value: string[] | undefined =
      Array.isArray(e.target.value) && e.target.value.length ? e.target.value : undefined;

    if (value === undefined) {
      modifyFieldFilterValue(filterQuery, field);
    } else {
      const filterValue =
        value?.includes(EMPTY) && !isEqual(this.value, [EMPTY]) ? null : { $in: value.filter(item => item !== EMPTY) };
      modifyFieldFilterValue(filterQuery, field, filterValue);
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
