import React, { Component } from 'react';
import { action, computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import { Check, Close } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { FilterBySelectionMode } from '../../../services/map/map.models';
import { getFieldFilterValue, modifyFieldFilterValue } from '../../../services/util/filters/filters';
import { XTableFilterProps } from '../../XTable/Filter/XTable-Filter.base';
import { FILTER_BY_SELECTION } from '../Attributes.models';

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
          value={FilterBySelectionMode.ONLY_SELECTED}
          size='small'
        >
          <Tooltip title='Оставить только выделенные объекты' enterDelay={700}>
            <span>
              <Check fontSize='small' />
            </span>
          </Tooltip>
        </ToggleButton>
        <ToggleButton
          className={cnAttributesCheckFilterButton({ selected: 'no' })}
          value={FilterBySelectionMode.ONLY_NOT_SELECTED}
          size='small'
        >
          <Tooltip title='Оставить только не выделенные объекты' enterDelay={700}>
            <span>
              <Close fontSize='small' />
            </span>
          </Tooltip>
        </ToggleButton>
      </ToggleButtonGroup>
    );
  }

  @computed
  private get value(): FilterBySelectionMode {
    const { filterQuery } = this.props;
    const value = getFieldFilterValue(filterQuery, FILTER_BY_SELECTION);

    return value === FilterBySelectionMode.ONLY_SELECTED || value === FilterBySelectionMode.ONLY_NOT_SELECTED
      ? value
      : FilterBySelectionMode.DISABLED;
  }

  @action.bound
  private handleChange(e: React.MouseEvent<HTMLElement, MouseEvent>, value: FilterBySelectionMode) {
    const { onBeforeFilterChange, onFilterChange, filterQuery } = this.props;

    onBeforeFilterChange();
    modifyFieldFilterValue(filterQuery, FILTER_BY_SELECTION, value || undefined);
    onFilterChange();
  }
}
