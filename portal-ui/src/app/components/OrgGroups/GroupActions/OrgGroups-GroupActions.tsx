import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { OrgActions } from '../../OrgActions/OrgActions';
import { CrgGroupExtended } from '../OrgGroups';

const cnOrgGroupsGroupActions = cn('OrgGroups', 'GroupActions');

interface OrgGroupsGroupActionsProps {
  rowData: CrgGroupExtended;
}

export const OrgGroupsGroupActions: FC<OrgGroupsGroupActionsProps> = ({ rowData }) => (
  <OrgActions className={cnOrgGroupsGroupActions()} group={rowData} />
);
