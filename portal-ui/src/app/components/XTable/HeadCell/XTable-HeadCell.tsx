import React, { Component, createRef } from 'react';
import { action, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { TableCell, TableCellProps, Tooltip } from '@mui/material';
import { VisibilityOff } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { PropertyType } from '../../../services/data/schema/schema.models';
import { FilterQuery } from '../../../services/util/filters/filters.models';
import { SortParams } from '../../../services/util/sortObjects';
import { DescriptionMark } from '../../DescriptionMark/DescriptionMark';
import { MIN_COLUMN_WIDTH } from '../CellContent/XTable-CellContent.base';
import { XTableCellContent } from '../CellContent/XTable-CellContent.composed';
import { XTableFilter } from '../Filter/XTable-Filter.composed';
import { XTableHeadCellBorder } from '../HeadCellBorder/XTable-HeadCellBorder';
import { XTableHeadCellLabel } from '../HeadCellLabel/XTable-HeadCellLabel';
import { XTableHeadCellTitle } from '../HeadCellTitle/XTable-HeadCellTitle';
import { XTableColumn } from '../XTable.models';

import '!style-loader!css-loader!sass-loader!./XTable-HeadCell.scss';
import '!style-loader!css-loader!sass-loader!../FilterActions/XTable-FilterActions.scss';

const cnXTableHeadCell = cn('XTable', 'HeadCell');
const cnXTableFilter = cn('XTable', 'Filter');
const cnXTableFilterActions = cn('XTable', 'FilterActions');

interface XTableHeadCellProps<T> extends TableCellProps {
  col: XTableColumn<T>;
  sortParams: Partial<SortParams<T>>;
  filterActive: boolean;
  filterQuery: FilterQuery;
  singleLineContent: boolean;
  width: number | undefined;
  hidden: boolean | undefined;
  enableMaxDefaultWidth?: boolean;
  onBeforeFilterChange(): void;
  onFilterChange(): void;
  onWidthChange(field: keyof T, width: number): void;
}

@observer
export class XTableHeadCell<T> extends Component<XTableHeadCellProps<T>> {
  private cellRef = createRef<HTMLTableCellElement>();
  private initialWidth = 0;

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
      enableMaxDefaultWidth,
      onBeforeFilterChange,
      onFilterChange,
      onWidthChange,
      ...otherProps
    } = this.props;

    const filterable = filterActive && col.filterable;
    const type = col.type || PropertyType.STRING;

    const cellProps: TableCellProps = {
      align: col.align,
      ...otherProps,
      ...col.headerCellProps,
      style: {
        ...style,
        ...col.headerCellProps?.style,
        '--XTableCellWidth': width || ''
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
      <TableCell {...cellProps} ref={this.cellRef} data-field={col.field}>
        <XTableCellContent
          singleLineContent={singleLineContent}
          enableMaxDefaultWidth={enableMaxDefaultWidth}
          width={width}
          col={col as XTableColumn<unknown>}
          inHead
        >
          <XTableHeadCellLabel
            col={col}
            onSort={this.handleSort}
            sortParams={sortParams}
            singleLineContent={singleLineContent}
          >
            <XTableHeadCellTitle col={col} singleLineContent={singleLineContent} />
            <div className={cnXTableFilterActions()}>
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
            </div>
          </XTableHeadCellLabel>
        </XTableCellContent>
        {filterable && col.field && (
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
        <XTableHeadCellBorder onResizeStart={this.handleResizeStart} onResize={this.handleResize} />
      </TableCell>
    );
  }

  @action.bound
  private handleSort() {
    const { col, sortParams } = this.props;

    if (!col.field) {
      throw new Error('Не указано поле, по которому сортировка');
    }

    if (sortParams.field === col.field) {
      sortParams.asc = !sortParams.asc;
    } else {
      sortParams.field = col.field;
      sortParams.asc = true;
    }
  }

  @action.bound
  private handleResizeStart() {
    const { col, onWidthChange } = this.props;
    const width = this.cellRef.current?.clientWidth;

    if (!col.field || !width) {
      return;
    }

    this.initialWidth = width;
    onWidthChange(col.field, width);
  }

  @action.bound
  private handleResize(deltaX: number) {
    const { col, onWidthChange } = this.props;

    if (!col.field) {
      return;
    }

    onWidthChange(col.field, Math.max(this.initialWidth + deltaX, col.minWidth || MIN_COLUMN_WIDTH));
  }
}
