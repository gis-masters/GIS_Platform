import React, { Component } from 'react';
import { action, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { Chip } from '@mui/material';
import { Clear } from '@mui/icons-material';
import { cloneDeep } from 'lodash';

import { FilterQuery, getFieldFilterPart, modifyFieldFilterValue } from '../../../services/util/filterObjects';
import { PropertyType } from '../../../services/data/schema.models';

import { XTableFilterPanelItemContent } from '../FilterPanelItemContent/XTable-FilterPanelItemContent.composed';
import { XTableColumn } from '../XTable';

import '!style-loader!css-loader!sass-loader!../FilterPanelItem/XTable-FilterPanelItem.scss';

export const cnXTableFilterPanelItem = cn('XTable', 'FilterPanelItem');

export interface XTableFilterPanelItemProps<T> {
  filter: FilterQuery;
  col: XTableColumn<T>;
  updateFilters: boolean;
  onUpdateFilter: (filter: FilterQuery) => void;
  onBeforeFilterChange(): void;
  onFilterChange(): void;
}

@observer
export class XTableFilterPanelItem<T> extends Component<XTableFilterPanelItemProps<T>> {
  constructor(props: XTableFilterPanelItemProps<T>) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { filter, col } = this.props;
    const ContentComponent = col.CustomFilterPanelItemComponent || XTableFilterPanelItemContent;

    return (
      <Chip
        color='info'
        className={cnXTableFilterPanelItem()}
        label={<ContentComponent type={col.type || PropertyType.STRING} filter={cloneDeep(filter)} col={col} />}
        onDelete={this.handleDelete}
        deleteIcon={<Clear fontSize='small' />}
        variant='outlined'
        size='small'
      />
    );
  }

  @action.bound
  private handleDelete() {
    const { filter, col, onUpdateFilter, onBeforeFilterChange, onFilterChange } = this.props;
    const field = String(col.field);

    if (getFieldFilterPart(filter, field)) {
      modifyFieldFilterValue(filter, field);
      onBeforeFilterChange();
      onUpdateFilter(filter);
      onFilterChange();
    }
  }
}
