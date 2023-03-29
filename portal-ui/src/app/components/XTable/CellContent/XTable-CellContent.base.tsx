import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import { ChildrenProps } from '../../../services/models';

import { XTableColumn, XTableColumnType } from '../XTable.models';

import '!style-loader!css-loader!sass-loader!./XTable-CellContent.scss';

export const cnXTableCellContent = cn('XTable', 'CellContent');

export interface XTableCellContentProps extends ChildrenProps, IClassNameProps, React.HTMLAttributes<HTMLSpanElement> {
  singleLineContent: boolean;
  unspecifiedWidth: boolean;
  col: XTableColumn<unknown>;
  type?: XTableColumnType;
  cellData?: unknown;
}

export const XTableCellContentBase: FC<XTableCellContentProps> = ({
  children,
  singleLineContent,
  unspecifiedWidth,
  className,
  cellData,
  ...spanProps
}) => (
  <span className={cnXTableCellContent({ singleLineContent, unspecifiedWidth }, [className])} {...spanProps}>
    {children !== null && children !== undefined ? children : ''}
  </span>
);
