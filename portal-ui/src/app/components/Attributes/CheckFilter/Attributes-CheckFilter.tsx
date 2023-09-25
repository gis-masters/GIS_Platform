import React, { Component } from 'react';
import { action, computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import { Check, Close } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { getFieldFilterValue, modifyFieldFilterValue } from '../../../services/util/filterObjects';
import { XTableFilterProps } from '../../XTable/Filter/XTable-Filter.base';
import { FilterBySelection } from '../../../services/map/map.models';
import { FILTER_BY_SELECTION } from '../Table/Attributes-Table';

import '!style-loader!css-loader!sass-loader!./Attributes-CheckFilter.scss';

const cnAttributesCheckFilter = cn('Attributes', 'CheckFilter');
const cnAttributesCheckFilterButton = cn('Attributes', 'CheckFilterButton');

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
        <ToggleButton
          className={cnAttributesCheckFilterButton({ selected: 'yes' })}
          value={FilterBySelection.ONLY_SELECTED}
          size='small'
        >
          <Tooltip title='Оставить только выделенные объекты' enterDelay={700}>
            <Check fontSize='small' />
          </Tooltip>
        </ToggleButton>
        <ToggleButton
          className={cnAttributesCheckFilterButton({ selected: 'no' })}
          value={FilterBySelection.ONLY_NOT_SELECTED}
          size='small'
        >
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
    const value = getFieldFilterValue(filterQuery, FILTER_BY_SELECTION);

    return value === FilterBySelection.ONLY_SELECTED || value === FilterBySelection.ONLY_NOT_SELECTED
      ? value
      : FilterBySelection.DISABLED;
  }

  @action.bound
  private handleChange(e: React.MouseEvent<HTMLElement, MouseEvent>, value: FilterBySelection) {
    const { onBeforeFilterChange, onFilterChange, filterQuery } = this.props;

    onBeforeFilterChange();
    modifyFieldFilterValue(filterQuery, FILTER_BY_SELECTION, value || undefined);
    onFilterChange();
  }
}
