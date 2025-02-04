import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { CrgGroup } from '../../services/auth/groups/groups.models';
import { CrgUser } from '../../services/auth/users/users.models';
import { PrincipalType } from '../../services/permissions/permissions.models';
import { organizationSettings } from '../../stores/OrganizationSettings.store';
import { OrgActionsDel } from './Del/OrgActions-Del';
import { OrgActionsEdit } from './Edit/OrgActions-Edit';
import { OrgActionsGroups } from './Groups/OrgActions-Groups';
import { OrgActionsListPermissions } from './ListPermissions/OrgActions-ListPermissions';

import '!style-loader!css-loader!sass-loader!./OrgActions.scss';

const cnOrgActions = cn('OrgActions');

type OrgActionsProps =
  | { user?: never; userGroups?: never; group: CrgGroup; className?: string }
  | { user: CrgUser; userGroups: CrgGroup[]; group?: never; className?: string };

export const OrgActions: FC<OrgActionsProps> = ({ user, userGroups, group, className }) => (
  <div className={cnOrgActions(null, [className])}>
    {user && <OrgActionsGroups user={user} userGroups={userGroups} />}
    {organizationSettings.showPermissions && (
      <OrgActionsListPermissions
        principalId={user ? user.id : group.id}
        principalType={user ? PrincipalType.USER : PrincipalType.GROUP}
        principalName={user ? user.name : group.name}
      />
    )}
    <OrgActionsEdit user={user} group={group} />
    {group && <OrgActionsDel group={group} user={user} />}
  </div>
);
