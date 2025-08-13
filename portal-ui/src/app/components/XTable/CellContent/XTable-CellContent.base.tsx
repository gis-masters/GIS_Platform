import React, { isValidElement, ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import { Tooltip } from '@mui/material';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import { isPropertyType, PropertyType } from '../../../services/data/schema/schema.models';
import { ChildrenProps } from '../../../services/models';
import { FilterQuery } from '../../../services/util/filters/filters.models';
import { XTableColumn, XTableColumnType } from '../XTable.models';

import '!style-loader!css-loader!sass-loader!./XTable-CellContent.scss';

export const cnXTableCellContent = cn('XTable', 'CellContent');

const INDENT = 29;

export interface XTableCellContentProps<T>
  extends ChildrenProps,
    IClassNameProps,
    React.HTMLAttributes<HTMLSpanElement> {
  singleLineContent: boolean;
  col: XTableColumn<T>;
  type?: XTableColumnType;
  filterParams?: FilterQuery;
  cellData?: unknown;
  inHead?: boolean;
  maxDefaultWidth?: number;
  enableMaxDefaultWidth?: boolean;
  width?: number;
}

const isColTypeAllowed = (type?: XTableColumnType): boolean => {
  if (type && isPropertyType(type)) {
    return [PropertyType.TEXT, PropertyType.STRING, PropertyType.CHOICE, PropertyType.FIAS].includes(type);
  }

  return false;
};

export const MIN_COLUMN_WIDTH = 108; // минимальная ширина с учетом отступов

export function XTableCellContentBase<T>({
  children,
  singleLineContent,
  className,
  cellData,
  type,
  col,
  inHead,
  filterParams,
  enableMaxDefaultWidth,
  ...spanProps
}: XTableCellContentProps<T>): ReactElement {
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const cellRef = useRef<HTMLSpanElement>(null);
  const cutWidthRef = useRef<boolean>(false);
  const maxDefaultWidth = col.maxDefaultWidth ? col.maxDefaultWidth + 28 : undefined;

  // высчитываем ширину элемента и устанавливаем ограничение при первом рендере
  const updateTooltipVisibility = useCallback(
    (setTooltip: (fullWidth: number) => void) => {
      if (spanProps.width) {
        return;
      }

      if (!(enableMaxDefaultWidth && cellRef.current && isColTypeAllowed(col.type))) {
        return;
      }

      const fullRect = cellRef.current.getBoundingClientRect();
      const styles = window.getComputedStyle(cellRef.current);
      const marginLeft = Number.parseFloat(styles.marginLeft);
      const marginRight = Number.parseFloat(styles.marginRight);
      const fullWidth = fullRect.width + marginLeft + marginRight;
      const currentText =
        cellRef.current.querySelector('.Highlight') || cellRef.current.querySelector('.TextOverflow-Value');
      const textWidth = currentText ? currentText.getBoundingClientRect().width + marginLeft + marginRight : 0;
      setTooltip(textWidth || fullWidth);
      if (cellRef.current.parentElement && cellRef.current.parentElement.offsetWidth > (textWidth || fullWidth)) {
        setShowTooltip(false);
      }

      let newWidth: number | undefined;
      if (fullWidth <= MIN_COLUMN_WIDTH) {
        // Если ширина меньше или равна 30px, устанавливаем минимальную ширину
        newWidth = MIN_COLUMN_WIDTH;
      } else if (fullWidth > (maxDefaultWidth || 500)) {
        // Если ширина превышает максимальную, устанавливаем максимальную ширину
        newWidth = maxDefaultWidth || 500;
      }

      if (!newWidth) {
        return;
      }

      const event = new CustomEvent<{ field: keyof T; width: number }>('columnWidthChange', {
        detail: {
          field: col.field as keyof T,
          width: newWidth
        }
      });
      window.dispatchEvent(event);
    },
    [enableMaxDefaultWidth, col.type, col.field, maxDefaultWidth, spanProps.width]
  );

  // задаем начальное значение ширины (если необходимо)
  useEffect(() => {
    const setTooltip = (fullWidth: number) => {
      cutWidthRef.current = fullWidth + INDENT > (maxDefaultWidth || 500);
      setShowTooltip(fullWidth + INDENT > (maxDefaultWidth || 500));
    };

    updateTooltipVisibility(setTooltip);
  }, [updateTooltipVisibility, maxDefaultWidth]);

  //  реагируем на изменение ширины
  useEffect(() => {
    const setTooltip = (fullWidth: number) => {
      if (spanProps.width) {
        setShowTooltip(spanProps.width - INDENT < fullWidth);
      }
    };

    updateTooltipVisibility(setTooltip);
  }, [updateTooltipVisibility, spanProps.width]);

  let currentWidth = spanProps.width;

  // если у текущего элемента уже есть ширина, то ничего не делаем, иначе добавляем её
  if (enableMaxDefaultWidth && cellRef.current && !currentWidth) {
    if (maxDefaultWidth && cutWidthRef.current) {
      currentWidth = maxDefaultWidth;
    } else if (isColTypeAllowed(col.type) && cutWidthRef.current) {
      currentWidth = 500;
    }
  }

  // выковыриваем текст из child если он там есть
  const childrenText =
    isValidElement<{ children?: string }>(children) && typeof children.props?.children === 'string'
      ? children.props.children
      : '';

  const tooltipText = (cellData?.toString() as string) || childrenText || '';

  const getXTableCellMinWidth = (): number => {
    if (col.field === '_idCheck') {
      return col.minWidth || 30;
    }

    return col.field ? MIN_COLUMN_WIDTH : col.minWidth || 30;
  };

  const getXTableCellWidth = (): number | string => {
    if (col.field === '_idCheck') {
      return 'auto';
    }

    return currentWidth || 'auto';
  };

  return (
    <span
      ref={cellRef}
      className={cnXTableCellContent(
        {
          singleLineContent,
          maxDefaultWidth:
            enableMaxDefaultWidth && singleLineContent && isColTypeAllowed(col.type) && !!maxDefaultWidth,
          type: type || 'string',
          display: !inHead && col.settings?.display
        },
        [className]
      )}
      {...spanProps}
      style={{
        ...spanProps.style,
        '--XTableCellWidth': getXTableCellWidth(),
        '--XTableCellMinWidth': getXTableCellMinWidth()
      }}
    >
      {children !== null && children !== undefined ? children : ''}

      {enableMaxDefaultWidth && singleLineContent && showTooltip && (
        <Tooltip title={tooltipText} placement='top'>
          <span className={cnXTableCellContent('TooltipTrigger')}>&nbsp;</span>
        </Tooltip>
      )}
    </span>
  );
}
