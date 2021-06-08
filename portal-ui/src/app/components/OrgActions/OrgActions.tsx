import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { PrincipalType } from '../../services/crg/permissions.models';
import { CrgGroup } from '../../services/crg/groups.service';
import { CrgUser } from '../../services/crg/users.service';

import { OrgActionsListPermissions } from './ListPermissions/OrgActions-ListPermissions';
import { OrgActionsGroups } from './Groups/OrgActions-Groups';
import { OrgActionsDel } from './Del/OrgActions-Del';
import { OrgActionsEdit } from './Edit/OrgActions-Edit';

import '!style-loader!css-loader!sass-loader!./OrgActions.scss';

const cnOrgActions = cn('OrgActions');

type OrgActionsProps =
  | { user?: never; userGroups?: never; group: CrgGroup }
  | { user: CrgUser; userGroups: CrgGroup[]; group?: never };

export const OrgActions: FC<OrgActionsProps> = ({ user, userGroups, group }) => (
  <div className={cnOrgActions()}>
    {user && <OrgActionsGroups user={user} userGroups={userGroups} />}
    <OrgActionsListPermissions
      principalId={user ? user.id : group.id}
      principalType={user ? PrincipalType.USER : PrincipalType.GROUP}
      principalName={user ? user.name : group.name}
    />
    {user && <OrgActionsEdit user={user} />}
    <OrgActionsDel group={group} user={user} />
  </div>
);
