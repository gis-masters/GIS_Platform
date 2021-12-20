import React, { Component } from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import { TableCell, TableSortLabel, TableCellProps } from '@mui/material';
import { cn } from '@bem-react/classname';

import { PropertyOption } from '../../../services/crg/schema.models';
import { FilterQuery } from '../../../services/util/filterObjects';
import { SortParams } from '../../../services/util/sortObjects';

import { FilterType } from '../Filter/XTable-Filter';
import { XTableFilter } from '../Filter/XTable-Filter.composed';

import '!style-loader!css-loader!sass-loader!./XTable-HeadCell.scss';

const cnXTableHeadCell = cn('XTable', 'HeadCell');

interface XTableHeadCellProps<T> extends TableCellProps {
  field?: keyof T;
  sortable?: boolean;
  sortParams?: SortParams<T>;
  filterable?: boolean;
  filterQuery?: FilterQuery;
  filterType: FilterType;
  filterOptions?: PropertyOption[];
  headerCellProps?: TableCellProps;
  onBeforeFilterChange: () => void;
  onFilterChange: () => void;
}

@observer
export class XTableHeadCell<T> extends Component<XTableHeadCellProps<T>> {
  render() {
    const {
      field,
      sortable,
      sortParams,
      filterable,
      filterType,
      filterQuery,
      filterOptions,
      children,
      headerCellProps,
      className,
      onBeforeFilterChange,
      onFilterChange
    } = this.props;

    const cellProps = {
      ...headerCellProps,
      ...this.props,
      className: cnXTableHeadCell({ sortable, filterable, filterType }, [className])
    };

    delete cellProps.field;
    delete cellProps.sortable;
    delete cellProps.filterable;
    delete cellProps.sortParams;
    delete cellProps.filterQuery;
    delete cellProps.filterType;
    delete cellProps.filterOptions;
    delete cellProps.headerCellProps;
    delete cellProps.onFilterChange;
    delete cellProps.onBeforeFilterChange;

    return (
      <TableCell {...cellProps}>
        {sortable ? (
          <TableSortLabel
            active={sortParams?.field === field}
            direction={sortParams?.asc || sortParams?.field !== field ? 'asc' : 'desc'}
            onClick={this.handleSort}
          >
            {children}
          </TableSortLabel>
        ) : (
          children
        )}
        {filterable && (
          <XTableFilter
            field={field as string}
            type={filterType}
            filterOptions={filterOptions}
            filterQuery={filterQuery}
            onBeforeFilterChange={onBeforeFilterChange}
            onFilterChange={onFilterChange}
          />
        )}
      </TableCell>
    );
  }

  @action.bound
  private handleSort() {
    const { field, sortParams } = this.props;

    if (sortParams.field !== field) {
      sortParams.field = field;
      sortParams.asc = true;
    } else {
      sortParams.asc = !sortParams.asc;
    }
  }
}
