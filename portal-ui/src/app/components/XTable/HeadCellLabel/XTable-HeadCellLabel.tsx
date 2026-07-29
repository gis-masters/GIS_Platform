import React, { type BaseHTMLAttributes, type ReactElement, useEffect, useRef } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import { TableSortLabel, Tooltip } from '@mui/material';
import { cn } from '@bem-react/classname';

import { type SortParams } from '../../../services/util/sortObjects';
import { XTableHeadCellLabelWrapper } from '../HeadCellLabelWrapper/XTable-HeadCellLabelWrapper';
import { type XTableColumn } from '../XTable.models';

import './XTable-HeadCellLabel.scss';

const cnXTableHeadCellLabel = cn('XTable', 'HeadCellLabel');

interface XTableHeadCellLabelProps<T> extends BaseHTMLAttributes<HTMLSpanElement> {
  col: XTableColumn<T>;
  sortParams?: Partial<SortParams<T>>;
  singleLineContent: boolean;
  onSort(): void;
}

const LINE_HEIGHT = 20; // Высота одной строки в пикселях
const MAX_LINES = 2; // Максимальное количество строк

type XTableHeadCellLabelState = {
  isMultiLine: boolean;
  ready: boolean;
  setReady(value: boolean): void;
  setIsMultiLine(value: boolean): void;
};

export const XTableHeadCellLabel = observer((props: XTableHeadCellLabelProps<unknown>) => {
  const { children, className, col, sortParams, onSort, singleLineContent, ...restProps } = props;
  const contentRef = useRef<HTMLSpanElement>(null);
  const state = useLocalObservable<XTableHeadCellLabelState>(() => ({
    isMultiLine: false,
    ready: false,

    setReady(value) {
      this.ready = value;
    },

    setIsMultiLine(value) {
      this.isMultiLine = value;
    }
  }));

  useEffect(() => {
    const checkRef = () => {
      if (contentRef.current) {
        if (contentRef.current.querySelector('.XTable-HeadCellTitle')?.textContent) {
          state.setReady(true);
        }
      } else {
        setTimeout(checkRef, 50); // Проверяем каждые 50 мс
      }
    };
    checkRef();
  }, [state]);

  useEffect(() => {
    if (!state.ready) {
      return;
    }
    if (contentRef.current && !singleLineContent) {
      const element = contentRef.current.querySelector('.XTable-HeadCellTitle');

      if (element) {
        const contentHeight = element.scrollHeight;
        const lineCount = Math.ceil(contentHeight / LINE_HEIGHT);

        // Если контент больше 2 строк, принудительно устанавливаем multiLine режим
        state.setIsMultiLine(lineCount > MAX_LINES);
      }
    }
  }, [col.width, singleLineContent, state, state.ready, children]);

  const cls = cnXTableHeadCellLabel(
    {
      singleLineContent,
      multiLineContent: state.isMultiLine && !singleLineContent
    },
    [className]
  );

  const content = (
    <span className={cls} {...restProps}>
      {children}
    </span>
  );

  const headLabel = (
    <XTableHeadCellLabelWrapper ref={contentRef}>
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
    </XTableHeadCellLabelWrapper>
  );

  return state.isMultiLine && !singleLineContent ? (
    <Tooltip title={col.title} placement='top'>
      {headLabel}
    </Tooltip>
  ) : (
    headLabel
  );
}) as <T>(p: XTableHeadCellLabelProps<T>) => ReactElement;
