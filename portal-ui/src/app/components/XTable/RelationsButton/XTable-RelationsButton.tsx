import React, { FC, ReactElement } from 'react';
import { cn } from '@bem-react/classname';

import { FilterQuery } from '../../../services/util/filters/filters.models';
import { RelationsButton } from '../../RelationsButton/RelationsButton';
import { XTableColumn } from '../XTable.models';

import '!style-loader!css-loader!sass-loader!./XTable-RelationsButton.scss';

const cnXTableRelationsButton = cn('XTable', 'RelationsButton');

interface XTableRelationsButtonProps<T> {
  rowData: T;
  col: XTableColumn<T>;
  filterActive: boolean;
  filterParams: FilterQuery;
}

export const XTableRelationsButton: FC<XTableRelationsButtonProps<unknown>> = (({ rowData, col }) => (
  <RelationsButton
    className={cnXTableRelationsButton()}
    obj={rowData as Record<string, unknown>}
    relations={col.settings?.relations || []}
    size='small'
  />
)) as <T>(p: XTableRelationsButtonProps<T>) => ReactElement;
