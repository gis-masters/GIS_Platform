import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import { PropertyType } from '../../../services/data/schema.models';
import { ChildrenProps } from '../../../services/models';

import { XTableColumn } from '../XTable';

import '!style-loader!css-loader!sass-loader!./XTable-CellContent.scss';

export const cnXTableCellContent = cn('XTable', 'CellContent');

export interface XTableCellContentProps extends ChildrenProps, IClassNameProps {
  singleLineContent: boolean;
  unspecifiedWidth: boolean;
  col: XTableColumn<unknown>;
  type?: PropertyType;
  cellData?: unknown;
}

export const XTableCellContentBase: FC<XTableCellContentProps> = ({
  children,
  singleLineContent,
  unspecifiedWidth,
  className
}) => (
  <span className={cnXTableCellContent({ singleLineContent, unspecifiedWidth }, [className])}>
    {children !== null && children !== undefined ? children : ''}
  </span>
);
