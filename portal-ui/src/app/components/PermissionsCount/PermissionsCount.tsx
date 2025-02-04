import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import { PermissionsListItem, PrincipalType } from '../../services/permissions/permissions.models';
import { allPermissions } from '../../stores/AllPermissions.store';

import '!style-loader!css-loader!sass-loader!./PermissionsCount.scss';

const cnPermissionsCount = cn('PermissionsCount');

interface PermissionsCountProps extends IClassNameProps {
  principalId: number;
  principalType: PrincipalType;
}

export const PermissionsCount: FC<PermissionsCountProps> = observer(({ principalId, principalType, className }) => {
  const lines: [string, PermissionsListItem[]][] = [
    ['проекты: ', allPermissions.forProjects],
    ['векторные слои: ', allPermissions.forTables],
    ['наборы данных: ', allPermissions.forDatasets]
  ];

  return (
    <div className={cnPermissionsCount(null, [className])}>
      {lines.map(([title, permissions]) => (
        <div className={cnPermissionsCount('Line')} key={title}>
          <span className={cnPermissionsCount('Title')}>{title}</span>
          <span className={cnPermissionsCount('Count')}>
            {permissions.reduce((acc, permission) => {
              const hasPermission = permission.permissions.some(
                item => item.principalId === principalId && item.principalType === principalType
              );

              if (hasPermission) {
                acc++;
              }

              return acc;
            }, 0)}
          </span>
        </div>
      ))}
    </div>
  );
});
