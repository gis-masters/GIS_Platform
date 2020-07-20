import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { PermissionsListItem } from '../../../services/crg/permissionsList.service';
import { PrincipalType } from '../../../services/crg/permissions.service';
import { FilterButton } from '../../FilterButton/FilterButton';
import { IdBadge } from '../../IdBadge/IdBadge';

import { PermissionsListDialogTitleText } from '../TitleText/PermissionsListDialog-TitleText';
import { PermissionsListDialogAdd } from '../Add/PermissionsListDialog-Add';

import '!style-loader!css-loader!sass-loader!./PermissionsListDialog-Title.scss';

const cnPermissionsListDialogTitle = cn('PermissionsListDialog', 'Title');

interface PermissionsListDialogTitleProps {
  principalId: number;
  principalType: PrincipalType;
  principalName: string;
  currentList: PermissionsListItem[];
  onAdd: (item: PermissionsListItem[]) => void;
  filterEnabled: boolean;
  onFilterClick: () => void;
}

export const PermissionsListDialogTitle: FC<PermissionsListDialogTitleProps> = ({
  principalId,
  principalType,
  principalName,
  onAdd,
  currentList: existingList,
  filterEnabled,
  onFilterClick
}) => (
  <div className={cnPermissionsListDialogTitle()}>
    <PermissionsListDialogTitleText>
      Разрешения
      {principalType === PrincipalType.USER && ' пользователя '}
      {principalType === PrincipalType.GROUP && ' группы '}
      {principalName}
      <IdBadge id={principalId} />
    </PermissionsListDialogTitleText>

    <PermissionsListDialogAdd
      onAdd={onAdd}
      currentList={existingList}
      principalId={principalId}
      principalType={principalType}
    />

    <FilterButton filterEnabled={filterEnabled} onClick={onFilterClick} />
  </div>
);
