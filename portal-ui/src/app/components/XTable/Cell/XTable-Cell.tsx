import React, { ReactElement } from 'react';
import { observer } from 'mobx-react';
import { TableCell, TableCellProps } from '@mui/material';
import { cn } from '@bem-react/classname';

import { FilterQuery } from '../../../services/util/filterObjects';
import { TextBadge } from '../../TextBadge/TextBadge';
import { Highlight } from '../../Highlight/Highlight';

import { XTableColumn } from '../XTable';
import { XTableCellContent } from '../CellContent/XTable-CellContent.composed';

import '!style-loader!css-loader!sass-loader!./XTable-Cell.scss';

const cnXTableCell = cn('XTable', 'Cell');

interface XTableCellProps<T> {
  rowData: T;
  col: XTableColumn<T>;
  singleLineContent: boolean;
  filterActive: boolean;
  filterQuery: FilterQuery;
  width: number | undefined;
  hidden: boolean | undefined;
  align: TableCellProps['align'] | undefined;
}

export const XTableCell = observer((({
  rowData,
  col,
  singleLineContent,
  width,
  filterActive,
  filterQuery,
  align,
  hidden: hiddenBySettings
}) => {
  const { CellContent, cellProps, field, getIdBadge, AfterCellContent, hidden, type, settings } = col;

  return (
    <TableCell
      className={cnXTableCell({
        hidden: hidden || hiddenBySettings,
        singleLineContent,
        withRelations: !!settings?.relations?.length
      })}
      align={align}
      {...(cellProps || {})}
      style={{ '--XTableCellWidth': width }}
    >
      <XTableCellContent
        singleLineContent={singleLineContent}
        unspecifiedWidth={!width}
        type={type}
        col={col as XTableColumn<unknown>}
        cellData={rowData[field]}
      >
        {CellContent ? (
          <CellContent rowData={rowData} field={field} filterActive={filterActive} filterParams={filterQuery} />
        ) : (
          <>
            <Highlight word={filterQuery[field as string]} enabled={filterActive}>
              {rowData[field] === null || rowData[field] === undefined ? '' : String(rowData[field])}
            </Highlight>
            {getIdBadge && <TextBadge id={getIdBadge(rowData)} />}
          </>
        )}
      </XTableCellContent>

      {AfterCellContent && (
        <AfterCellContent rowData={rowData} filterActive={filterActive} filterParams={filterQuery} col={col} />
      )}
    </TableCell>
  );
}) as <T>(p: XTableCellProps<T>) => ReactElement);
