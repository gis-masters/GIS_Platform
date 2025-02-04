import React, { ReactElement, ReactNode } from 'react';
import { Tooltip } from '@mui/material';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import { FilterQuery } from '../../../services/util/filters/filters.models';
import { XTableColumn } from '../XTable.models';

import '!style-loader!css-loader!sass-loader!./XTable-FilterPanelItemContent.scss';
import '!style-loader!css-loader!sass-loader!../FilterPanelItemContentPart/XTable-FilterPanelItemContentPart.scss';

export const cnXTableFilterPanelItemContent = cn('XTable', 'FilterPanelItemContent');
export const cnXTableFilterPanelItemContentPart = cn('XTable', 'FilterPanelItemContentPart');

export interface XTableFilterPanelItemContentProps<T> extends IClassNameProps {
  type: string;
  filter: FilterQuery;
  col: XTableColumn<T>;
  value?: ReactNode;
}

export const XTableFilterPanelItemContentBase = (({
  filter,
  col,
  className,
  value
}: XTableFilterPanelItemContentProps<unknown>) => {
  const content = (
    <>
      <span className={cnXTableFilterPanelItemContentPart()}>{col.title}:</span>
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
}) as <T>(p: XTableFilterPanelItemContentProps<T>) => ReactElement;
