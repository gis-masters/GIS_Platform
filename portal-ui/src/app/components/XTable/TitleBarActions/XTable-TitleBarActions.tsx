import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../../services/models';
import { FilterButton } from '../../FilterButton/FilterButton';
import { ToolbarDivider } from '../../ToolbarDivider/ToolbarDivider';
import { XTablePageSize } from '../PageSize/XTable-PageSize';

import '!style-loader!css-loader!sass-loader!./XTable-TitleBarActions.scss';

const cnXTableTitleBarActions = cn('XTable', 'TitleBarActions');

interface XTableTitleBarActionsProps extends ChildrenProps {
  filterable: boolean;
  filterActive: boolean;
  customActionFirst?: boolean;
  pageSize: number;
  onToggleFilter(): void;
  onChangePageSize(size: number): void;
}

export const XTableTitleBarActions: FC<XTableTitleBarActionsProps> = ({
  children,
  filterActive,
  customActionFirst,
  filterable,
  pageSize,
  onToggleFilter,
  onChangePageSize
}) => (
  <div className={cnXTableTitleBarActions()}>
    {customActionFirst && children}
    <XTablePageSize pageSize={pageSize} onChange={onChangePageSize} />
    <ToolbarDivider />
    {filterable && <FilterButton filterActive={filterActive} onClick={onToggleFilter} />}
    {!customActionFirst && children}
  </div>
);
