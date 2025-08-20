import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { OrgActions } from '../../OrgActions/OrgActions';
import { CrgUserExtended } from '../OrgUsers';

const cnOrgUsersUserActions = cn('OrgUsers', 'UserActions');

interface OrgUsersUserActionsProps {
  rowData: CrgUserExtended;
}

export const OrgUsersUserActions: FC<OrgUsersUserActionsProps> = ({ rowData }) => (
  <OrgActions className={cnOrgUsersUserActions()} user={rowData} userGroups={rowData.groups} />
);
