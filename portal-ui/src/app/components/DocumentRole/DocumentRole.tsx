import React, { FC, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { EditOutlined, HealthAndSafetyOutlined, VisibilityOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { getLibraryRecord } from '../../services/data/library/library.service';
import { Role } from '../../services/permissions/permissions.models';

import '!style-loader!css-loader!sass-loader!./DocumentRole.scss';

function getRoleTitle(role: Role): string {
  const roleTitles = {
    [Role.OWNER]: 'полное управление',
    [Role.CONTRIBUTOR]: 'редактирование, чтение',
    [Role.VIEWER]: 'чтение'
  };

  return `Вам доступно: ${roleTitles[role]}`;
}

const cnDocumentRole = cn('DocumentRole');

interface DocumentRoleProps {
  id: number;
  libraryTableName: string;
  role?: Role;
}

export const DocumentRole: FC<DocumentRoleProps> = observer(({ id, libraryTableName, role }) => {
  const [localRole, setRole] = useState<Role | undefined>(role);

  useEffect(() => {
    void (async () => {
      const { role: newRole } = await getLibraryRecord(libraryTableName, id);

      if (newRole && localRole !== newRole) {
        setRole(newRole);
      }
    })();
  }, [id, libraryTableName, localRole]);

  // иконки буду заменены в #2169

  return (
    <>
      {!!localRole && (
        <div className={cnDocumentRole()}>
          <Tooltip title={getRoleTitle(localRole)}>
            <span className={cnDocumentRole('Description')}>
              <VisibilityOutlined color={localRole === Role.VIEWER ? 'success' : 'disabled'} />
              <EditOutlined color={localRole === Role.CONTRIBUTOR ? 'success' : 'disabled'} />
              <HealthAndSafetyOutlined color={localRole === Role.OWNER ? 'success' : 'disabled'} />
            </span>
          </Tooltip>
        </div>
      )}
    </>
  );
});
