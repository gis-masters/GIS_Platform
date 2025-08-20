import React, { BaseHTMLAttributes, forwardRef, ReactElement, Ref, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import { TableSortLabel, Tooltip } from '@mui/material';
import { cn } from '@bem-react/classname';

import { SortParams } from '../../../services/util/sortObjects';
import { XTableColumn } from '../XTable.models';

import '!style-loader!css-loader!sass-loader!./XTable-HeadCellLabel.scss';

const cnXTableHeadCellLabel = cn('XTable', 'HeadCellLabel');
const cnXTableHeadCellLabelWrapper = cn('XTable', 'HeadCellLabelWrapper');

interface XTableHeadCellLabelProps<T> extends BaseHTMLAttributes<HTMLSpanElement> {
  col: XTableColumn<T>;
  sortParams?: Partial<SortParams<T>>;
  singleLineContent: boolean;
  onSort(): void;
}

const LINE_HEIGHT = 20; // Высота одной строки в пикселях
const MAX_LINES = 2; // Максимальное количество строк

export const XTableHeadCellLabel = observer(
  forwardRef<HTMLSpanElement, XTableHeadCellLabelProps<unknown>>(
    ({ children, className, col, sortParams, onSort, singleLineContent, ...props }) => {
      const contentRef = useRef<HTMLSpanElement>(null);
      const [isMultiLine, setIsMultiLine] = useState(false);
      const [ready, setReady] = useState(false);

      useEffect(() => {
        const checkRef = () => {
          if (contentRef.current) {
            if (contentRef.current.querySelector('.XTable-HeadCellTitle')?.textContent) {
              setReady(true);
            }
          } else {
            setTimeout(checkRef, 50); // Проверяем каждые 50 мс
          }
        };
        checkRef();
      }, []);

      useEffect(() => {
        if (!ready) {
          return;
        }
        if (contentRef.current && !singleLineContent) {
          const element = contentRef.current.querySelector('.XTable-HeadCellTitle');

          if (element) {
            const contentHeight = element.scrollHeight;
            const lineCount = Math.ceil(contentHeight / LINE_HEIGHT);

            // Если контент больше 2 строк, принудительно устанавливаем multiLine режим
            setIsMultiLine(lineCount > MAX_LINES);
          }
        }
      }, [col.width, singleLineContent, ready, children]);

      const cls = cnXTableHeadCellLabel(
        {
          singleLineContent,
          multiLineContent: isMultiLine && !singleLineContent
        },
        [className]
      );

      const content = (
        <span className={cls} {...props}>
          {children}
        </span>
      );

      const headLabel = (
        <span ref={contentRef} className={cnXTableHeadCellLabelWrapper()}>
          {col.sortable ? (
            <TableSortLabel
              active={sortParams?.field === col.field}
              direction={sortParams?.asc || sortParams?.field !== col.field ? 'asc' : 'desc'}
              onClick={onSort}
              hideSortIcon={false}
              IconComponent={undefined}
              className={cls}
              sx={{
                '& .MuiTableSortLabel-icon': {
                  order: 1,
                  marginLeft: '5px',
                  visibility: 'visible',
                  opacity: 0.5
                }
              }}
            >
              {children}
            </TableSortLabel>
          ) : (
            content
          )}
        </span>
      );

      return isMultiLine && !singleLineContent ? (
        <Tooltip title={col.title} placement='top'>
          {headLabel}
        </Tooltip>
      ) : (
        headLabel
      );
    }
  )
) as <T>(p: XTableHeadCellLabelProps<T> & { ref?: Ref<HTMLDivElement> }) => ReactElement;
