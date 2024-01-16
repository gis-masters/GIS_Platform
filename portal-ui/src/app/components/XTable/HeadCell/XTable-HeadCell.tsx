import React, { Component, createRef } from 'react';
import { action, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { TableCell, TableCellProps, Tooltip } from '@mui/material';
import { VisibilityOff } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { PropertyType } from '../../../services/data/schema/schema.models';
import { FilterQuery } from '../../../services/util/filterObjects';
import { SortParams } from '../../../services/util/sortObjects';
import { DescriptionMark } from '../../DescriptionMark/DescriptionMark';

import { XTableColumn } from '../XTable.models';
import { XTableFilter } from '../Filter/XTable-Filter.composed';
import { XTableHeadCellLabel } from '../HeadCellLabel/XTable-HeadCellLabel';
import { XTableHeadCellTitle } from '../HeadCellTitle/XTable-HeadCellTitle';
import { XTableHeadCellBorder } from '../HeadCellBorder/XTable-HeadCellBorder';
import { XTableCellContent } from '../CellContent/XTable-CellContent.composed';

import '!style-loader!css-loader!sass-loader!./XTable-HeadCell.scss';

const cnXTableHeadCell = cn('XTable', 'HeadCell');
const cnXTableFilter = cn('XTable', 'Filter');

interface XTableHeadCellProps<T> extends TableCellProps {
  col: XTableColumn<T>;
  sortParams: SortParams<T>;
  filterActive: boolean;
  filterQuery: FilterQuery;
  singleLineContent: boolean;
  width: number | undefined;
  hidden: boolean | undefined;
  onBeforeFilterChange(): void;
  onFilterChange(): void;
  onWidthChange(field: keyof T, width: number): void;
}

const MIN_CELL_WIDTH = 80;

@observer
export class XTableHeadCell<T> extends Component<XTableHeadCellProps<T>> {
  private cellRef = createRef<HTMLTableCellElement>();
  private initialWidth: number;

  constructor(props: XTableHeadCellProps<T>) {
    super(props);
    makeObservable(this);
  }

  render() {
    const {
      col,
      sortParams,
      filterActive,
      filterQuery,
      className,
      singleLineContent,
      style = {},
      width,
      hidden,
      onBeforeFilterChange,
      onFilterChange,
      onWidthChange,
      ...otherProps
    } = this.props;

    const filterable = filterActive && col.filterable;
    const type = col.type || PropertyType.STRING;

    const cellProps = {
      align: col.align,
      ...otherProps,
      ...col.headerCellProps,
      style: {
        ...style,
        ...col.headerCellProps?.style,
        '--XTableCellWidth': width
      },
      className: cnXTableHeadCell(
        {
          sortable: col.sortable,
          filterable,
          type,
          hidden: col.hidden || hidden,
          singleLineContent
        },
        [className, col.headerCellProps?.className]
      )
    };

    const FilterComponent = col.CustomFilterComponent || XTableFilter;

    return (
      <TableCell {...cellProps} ref={this.cellRef}>
        <XTableCellContent singleLineContent={singleLineContent} col={col as XTableColumn<unknown>}>
          <XTableHeadCellLabel
            col={col}
            onSort={this.handleSort}
            sortParams={sortParams}
            singleLineContent={singleLineContent}
          >
            <XTableHeadCellTitle col={col} singleLineContent={singleLineContent} />
            {col.description && (
              <>
                &nbsp;
                <DescriptionMark>{col.description}</DescriptionMark>
              </>
            )}
            {col.hidden && (
              <>
                &nbsp;
                <Tooltip title='Колонка скрыта настройками. Отображается из-за наличия фильтрации или сортировки.'>
                  <VisibilityOff color='action' fontSize='small' />
                </Tooltip>
              </>
            )}
          </XTableHeadCellLabel>
        </XTableCellContent>
        {filterable && (
          <FilterComponent
            className={col.CustomFilterComponent && cnXTableFilter({ type: 'custom' })}
            field={col.field}
            type={type}
            options={col.settings?.options}
            filterQuery={filterQuery}
            onBeforeFilterChange={onBeforeFilterChange}
            onFilterChange={onFilterChange}
          />
        )}
        <XTableHeadCellBorder onResizeStart={this.resizeStartHandler} onResize={this.resizeHandler} />
      </TableCell>
    );
  }

  @action.bound
  private handleSort() {
    const { col, sortParams } = this.props;

    if (sortParams.field === col.field) {
      sortParams.asc = !sortParams.asc;
    } else {
      sortParams.field = col.field;
      sortParams.asc = true;
    }
  }

  @action.bound
  private resizeStartHandler() {
    const { col, onWidthChange } = this.props;
    this.initialWidth = this.cellRef.current.clientWidth;
    onWidthChange(col.field, this.cellRef.current.clientWidth);
  }

  @action.bound
  private resizeHandler(deltaX: number) {
    const { col, onWidthChange } = this.props;
    onWidthChange(col.field, Math.max(this.initialWidth + deltaX, col.minWidth || MIN_CELL_WIDTH));
  }
}
