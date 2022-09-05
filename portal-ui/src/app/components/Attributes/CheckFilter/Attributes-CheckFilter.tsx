import React, { Component } from 'react';
import { action, computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import { Check, Close } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { FilterBySelection } from '../../../stores/Map.store';
import { XTableFilterProps } from '../../XTable/Filter/XTable-Filter.base';

import '!style-loader!css-loader!sass-loader!./Attributes-CheckFilter.scss';

const cnAttributesCheckFilter = cn('Attributes', 'CheckFilter');

@observer
export class AttributesCheckFilter extends Component<XTableFilterProps> {
  constructor(props: XTableFilterProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { className } = this.props;

    return (
      <ToggleButtonGroup
        className={cnAttributesCheckFilter(null, [className])}
        value={this.value}
        exclusive
        onChange={this.handleChange}
        size='small'
      >
        <ToggleButton value={FilterBySelection.ONLY_SELECTED} size='small'>
          <Tooltip title='Оставить только выделенные объекты' enterDelay={700}>
            <Check fontSize='small' />
          </Tooltip>
        </ToggleButton>
        <ToggleButton value={FilterBySelection.ONLY_NOT_SELECTED} size='small'>
          <Tooltip title='Оставить только не выделенные объекты' enterDelay={700}>
            <Close fontSize='small' />
          </Tooltip>
        </ToggleButton>
      </ToggleButtonGroup>
    );
  }

  @computed
  private get value(): FilterBySelection {
    const { filterQuery } = this.props;

    return filterQuery.filterBySelection === FilterBySelection.ONLY_SELECTED ||
      filterQuery.filterBySelection === FilterBySelection.ONLY_NOT_SELECTED
      ? filterQuery.filterBySelection
      : FilterBySelection.DISABLED;
  }

  @action.bound
  private handleChange(e: React.MouseEvent<HTMLElement, MouseEvent>, value: FilterBySelection) {
    const { onBeforeFilterChange, onFilterChange, filterQuery } = this.props;
    onBeforeFilterChange();
    if (value) {
      filterQuery.filterBySelection = value;
    } else {
      delete filterQuery.filterBySelection;
    }
    onFilterChange();
  }
}
