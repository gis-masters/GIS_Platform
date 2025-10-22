import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { PrincipalType } from '../../../services/permissions/permissions.models';
import { PermissionsCount } from '../../PermissionsCount/PermissionsCount';
import { type CrgGroupExtended } from '../OrgGroups.models';

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
