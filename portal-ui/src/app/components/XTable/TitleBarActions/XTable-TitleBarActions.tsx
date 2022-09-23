import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../../services/models';
import { FilterButton } from '../../FilterButton/FilterButton';

import { XTablePageSize } from '../PageSize/XTable-PageSize';

const cnXTableTitleBarActions = cn('XTable', 'TitleBarActions');

interface XTableTitleBarActionsProps extends ChildrenProps {
  filterable: boolean;
  filterActive: boolean;
  pageSize: number;
  onToggleFilter(): void;
  onChangePageSize(size: number): void;
}

export const XTableTitleBarActions: FC<XTableTitleBarActionsProps> = ({
  children,
  filterActive,
  filterable,
  pageSize,
  onToggleFilter,
  onChangePageSize
}) => (
  <div className={cnXTableTitleBarActions()}>
    <XTablePageSize pageSize={pageSize} onChange={onChangePageSize} />
    {filterable && <FilterButton filterActive={filterActive} onClick={onToggleFilter} />}
    {children}
  </div>
);
