import React, { FC, ReactNode } from 'react';
import { cn } from '@bem-react/classname';

import { FilterButton } from '../../FilterButton/FilterButton';

import { XTablePageSize } from '../PageSize/XTable-PageSize';

const cnXTableHeaderActions = cn('XTable', 'HeaderActions');

interface XTableHeaderActionsProps {
  filterable: boolean;
  filterActive: boolean;
  pageSize: number;
  onToggleFilter(): void;
  onChangePageSize(e: React.ChangeEvent<HTMLInputElement>): void;
  children: ReactNode;
}

export const XTableHeaderActions: FC<XTableHeaderActionsProps> = ({
  children,
  filterActive,
  filterable,
  pageSize,
  onToggleFilter,
  onChangePageSize
}) => (
  <div className={cnXTableHeaderActions()}>
    {children}
    <XTablePageSize pageSize={pageSize} onChange={onChangePageSize} />
    {filterable && <FilterButton filterActive={filterActive} onClick={onToggleFilter} />}
  </div>
);
