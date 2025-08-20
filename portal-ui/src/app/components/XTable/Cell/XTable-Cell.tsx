import React, { ReactElement } from 'react';
import { observer } from 'mobx-react';
import { TableCell, TableCellProps } from '@mui/material';
import { cn } from '@bem-react/classname';

import { getFieldFilterValue } from '../../../services/util/filters/filters';
import { FilterQuery } from '../../../services/util/filters/filters.models';
import { Highlight } from '../../Highlight/Highlight';
import { TextBadge } from '../../TextBadge/TextBadge';
import { TextOverflow } from '../../TextOverflow/TextOverflow';
import { XTableCellContent } from '../CellContent/XTable-CellContent.composed';
import { XTableColumn } from '../XTable.models';

import '!style-loader!css-loader!sass-loader!./XTable-Cell.scss';

const cnXTableCell = cn('XTable', 'Cell');

interface XTableCellProps<T> {
  rowData: T;
  col: XTableColumn<T>;
  singleLineContent: boolean;
  filterActive: boolean;
  filterQuery: FilterQuery;
  width?: number;
  enableMaxDefaultWidth?: boolean;
  hidden?: boolean;
  align?: TableCellProps['align'];
}

export const XTableCell = observer((({
  rowData,
  col,
  singleLineContent,
  width,
  enableMaxDefaultWidth,
  filterActive,
  filterQuery,
  align,
  hidden: hiddenBySettings
}) => {
  const {
    CellContent,
    cellContentProps,
    cellProps,
    field,
    getIdBadge,
    AfterCellContent,
    BeforeCellContent,
    hidden,
    type,
    settings
  } = col;

  return (
    <TableCell
      className={cnXTableCell({
        hidden: hidden || hiddenBySettings,
        singleLineContent,
        withRelations: !!settings?.relations?.length
      })}
      align={align}
      {...(cellProps || {})}
      style={width ? { '--XTableCellWidth': width } : undefined}
      data-field={field}
    >
      {BeforeCellContent && (
        <BeforeCellContent rowData={rowData} filterActive={filterActive} filterParams={filterQuery} col={col} />
      )}
      <XTableCellContent
        singleLineContent={singleLineContent}
        type={type}
        col={col}
        width={width}
        enableMaxDefaultWidth={enableMaxDefaultWidth}
        filterParams={filterQuery}
        cellData={field && rowData[field]}
        {...cellContentProps}
      >
        {CellContent ? (
          <CellContent
            rowData={rowData}
            col={col}
            filterActive={filterActive}
            filterParams={filterQuery}
            {...cellContentProps}
          />
        ) : (
          <>
            {field && (
              <TextOverflow maxLines={2}>
                <Highlight word={getFieldFilterValue(filterQuery, field)} enabled={filterActive}>
                  {rowData[field] === null || rowData[field] === undefined ? '' : String(rowData[field])}
                </Highlight>
                {getIdBadge && <TextBadge id={getIdBadge(rowData)} />}
              </TextOverflow>
            )}
          </>
        )}
      </XTableCellContent>
      {AfterCellContent && (
        <AfterCellContent rowData={rowData} filterActive={filterActive} filterParams={filterQuery} col={col} />
      )}
    </TableCell>
  );
}) as <T>(p: XTableCellProps<T>) => ReactElement);
