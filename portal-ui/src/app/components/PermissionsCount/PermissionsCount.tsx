import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { observer } from 'mobx-react';

import { PrincipalType } from '../../services/crg/permissions.models';
import { allPermissions } from '../../stores/AllPermissions.store';
import { PermissionsListItem } from '../../services/crg/allPermissions.service';

import '!style-loader!css-loader!sass-loader!./PermissionsCount.scss';

const cnPermissionsCount = cn('PermissionsCount');

interface PermissionsCountProps {
  principalId: number;
  principalType: PrincipalType;
}

export const PermissionsCount: FC<PermissionsCountProps> = observer(({ principalId, principalType }) => {
  const lines: [string, PermissionsListItem[]][] = [
    ['проекты: ', allPermissions.forProjects],
    ['векторные слои: ', allPermissions.forTables],
    ['наборы данных: ', allPermissions.forDatasets]
  ];

  return (
    <div className={cnPermissionsCount()}>
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
