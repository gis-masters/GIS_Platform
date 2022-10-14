import React, { Component } from 'react';
import { cn } from '@bem-react/classname';
import { observer } from 'mobx-react';
import { Chip } from '@mui/material';
import { boundMethod } from 'autobind-decorator';
import { Clear } from '@mui/icons-material';
import { cloneDeep } from 'lodash';

import { FilterQuery } from '../../../services/util/filterObjects';
import { PropertyType } from '../../../services/data/schema.models';

import { XTableColumn } from '../XTable';
import { XTableFilterPanelItemContent } from '../FilterPanelItemContent/XTable-FilterPanelItemContent.composed';

import '!style-loader!css-loader!sass-loader!../FilterPanelItem/XTable-FilterPanelItem.scss';

export const cnXTableFilterPanelItem = cn('XTable', 'FilterPanelItem');

export interface XTableFilterPanelItemProps {
  filter: FilterQuery;
  col: XTableColumn<any>;
  updateFilters: boolean;
  onUpdateFilter: (filter: FilterQuery) => void;
  onBeforeFilterChange(): void;
  onFilterChange(): void;
}

@observer
export class XTableFilterPanelItem extends Component<XTableFilterPanelItemProps> {
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

  @boundMethod
  private handleDelete() {
    const { filter, col, onUpdateFilter, onBeforeFilterChange, onFilterChange } = this.props;
    const title = String(col.field);

    if (filter[title]) {
      delete filter[title];
      onBeforeFilterChange();
      onUpdateFilter(filter);
      onFilterChange();
    }
  }
}
