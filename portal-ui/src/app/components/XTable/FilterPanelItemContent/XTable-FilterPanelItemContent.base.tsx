import React, { FC, ReactNode } from 'react';
import { cn } from '@bem-react/classname';
import { Tooltip } from '@mui/material';
import { IClassNameProps } from '@bem-react/core';

import { FilterQuery } from '../../../services/util/filterObjects';

import { XTableColumn } from '../XTable';

import '!style-loader!css-loader!sass-loader!./XTable-FilterPanelItemContent.scss';
import '!style-loader!css-loader!sass-loader!../FilterPanelItemContentPart/XTable-FilterPanelItemContentPart.scss';

export const cnXTableFilterPanelItemContent = cn('XTable', 'FilterPanelItemContent');
export const cnXTableFilterPanelItemContentPart = cn('XTable', 'FilterPanelItemContentPart');

export interface XTableFilterPanelItemContentProps extends IClassNameProps {
  type: string;
  filter: FilterQuery;
  col: XTableColumn<any>;
  value?: ReactNode;
}

export const XTableFilterPanelItemContentBase: FC<XTableFilterPanelItemContentProps> = ({
  filter,
  col,
  className,
  value
}) => {
  const content = (
    <>
      <span className={cnXTableFilterPanelItemContentPart()}>{col.title}</span>:{' '}
      <span className={cnXTableFilterPanelItemContentPart({ value: true })}>
        {value || String(filter[String(col.field)])}
      </span>
    </>
  );

  return (
    <Tooltip title={content}>
      <span className={cnXTableFilterPanelItemContent(null, [className])}>{content}</span>
    </Tooltip>
  );
};
