import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { PrincipalType } from '../../../services/permissions/permissions.models';
import { PermissionsCount } from '../../PermissionsCount/PermissionsCount';
import { CrgUserExtended } from '../OrgUsers';

const cnOrgUsersPermissionsCount = cn('OrgUsers', 'PermissionsCount');

interface OrgUsersPermissionsCountProps {
  rowData: CrgUserExtended;
}

export const OrgUsersPermissionsCount: FC<OrgUsersPermissionsCountProps> = ({ rowData }) => (
  <PermissionsCount
    className={cnOrgUsersPermissionsCount()}
    principalId={rowData.id}
    principalType={PrincipalType.USER}
  />
);
