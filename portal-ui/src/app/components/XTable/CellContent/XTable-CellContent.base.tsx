import React, { ReactElement } from 'react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import { ChildrenProps } from '../../../services/models';

import { XTableColumn, XTableColumnType } from '../XTable.models';

import '!style-loader!css-loader!sass-loader!./XTable-CellContent.scss';

export const cnXTableCellContent = cn('XTable', 'CellContent');

export interface XTableCellContentProps<T>
  extends ChildrenProps,
    IClassNameProps,
    React.HTMLAttributes<HTMLSpanElement> {
  singleLineContent: boolean;
  col: XTableColumn<T>;
  type?: XTableColumnType;
  cellData?: unknown;
}

export const XTableCellContentBase: <T>(props: XTableCellContentProps<T>) => ReactElement = (({
  children,
  singleLineContent,
  className,
  cellData,
  ...spanProps
}) => (
  <span className={cnXTableCellContent({ singleLineContent }, [className])} {...spanProps}>
    {children !== null && children !== undefined ? children : ''}
  </span>
)) as <T>(props: XTableCellContentProps<T>) => ReactElement;
