import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { PrincipalType } from '../../../services/permissions/permissions.models';
import { PermissionsCount } from '../../PermissionsCount/PermissionsCount';
import { CrgGroupExtended } from '../OrgGroups';

const cnOrgGroupsPermissionsCount = cn('OrgGroups', 'PermissionsCount');

interface OrgGroupsPermissionsCountProps {
  rowData: CrgGroupExtended;
}

export const OrgGroupsPermissionsCount: FC<OrgGroupsPermissionsCountProps> = ({ rowData }) => (
  <PermissionsCount
    className={cnOrgGroupsPermissionsCount()}
    principalId={rowData.id}
    principalType={PrincipalType.GROUP}
  />
);
