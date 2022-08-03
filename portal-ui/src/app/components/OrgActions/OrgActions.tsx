import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { PrincipalType } from '../../services/data/permissions.models';
import { CrgGroup } from '../../services/data/groups.service';
import { CrgUser } from '../../services/data/users.service';

import { OrgActionsListPermissions } from './ListPermissions/OrgActions-ListPermissions';
import { OrgActionsGroups } from './Groups/OrgActions-Groups';
import { OrgActionsDel } from './Del/OrgActions-Del';
import { OrgActionsEdit } from './Edit/OrgActions-Edit';

import '!style-loader!css-loader!sass-loader!./OrgActions.scss';

const cnOrgActions = cn('OrgActions');

type OrgActionsProps =
  | { user?: never; userGroups?: never; group: CrgGroup; className?: string }
  | { user: CrgUser; userGroups: CrgGroup[]; group?: never; className?: string };

export const OrgActions: FC<OrgActionsProps> = ({ user, userGroups, group, className }) => (
  <div className={cnOrgActions(null, [className])}>
    {user && <OrgActionsGroups user={user} userGroups={userGroups} />}
    <OrgActionsListPermissions
      principalId={user ? user.id : group.id}
      principalType={user ? PrincipalType.USER : PrincipalType.GROUP}
      principalName={user ? user.name : group.name}
    />
    <OrgActionsEdit user={user} group={group} />
    <OrgActionsDel group={group} user={user} />
  </div>
);
