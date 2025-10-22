import React, { type FC, type ReactElement } from 'react';
import { cn } from '@bem-react/classname';

import { type FilterQuery } from '../../../services/util/filters/filters.models';
import { RelationsButton } from '../../RelationsButton/RelationsButton';
import { type XTableColumn } from '../XTable.models';

import './XTable-RelationsButton.scss';

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
