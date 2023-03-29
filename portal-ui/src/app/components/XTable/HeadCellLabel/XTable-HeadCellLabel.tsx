import React, { BaseHTMLAttributes, forwardRef, ReactElement, Ref } from 'react';
import { observer } from 'mobx-react';
import { TableSortLabel } from '@mui/material';
import { cn } from '@bem-react/classname';

import { SortParams } from '../../../services/util/sortObjects';

import { XTableColumn } from '../XTable.models';

import '!style-loader!css-loader!sass-loader!./XTable-HeadCellLabel.scss';

const cnXTableHeadCellLabel = cn('XTable', 'HeadCellLabel');

interface XTableHeadCellLabelProps<T> extends BaseHTMLAttributes<HTMLSpanElement> {
  col: XTableColumn<T>;
  sortParams: SortParams<T>;
  onSort(): void;
  singleLineContent: boolean;
}

export const XTableHeadCellLabel = observer(
  forwardRef<HTMLSpanElement, XTableHeadCellLabelProps<unknown>>(
    ({ children, className, col, sortParams, onSort, singleLineContent, ...props }, ref) => {
      const cls = cnXTableHeadCellLabel({ singleLineContent }, [className]);

      return col.sortable ? (
        <TableSortLabel
          active={sortParams?.field === col.field}
          direction={sortParams?.asc || sortParams?.field !== col.field ? 'asc' : 'desc'}
          onClick={onSort}
          hideSortIcon={!col.sortable}
          className={cls}
        >
          {children}
        </TableSortLabel>
      ) : (
        <span ref={ref} className={cls} {...props}>
          {children}
        </span>
      );
    }
  )
) as <T>(p: XTableHeadCellLabelProps<T> & { ref?: Ref<HTMLDivElement> }) => ReactElement;
