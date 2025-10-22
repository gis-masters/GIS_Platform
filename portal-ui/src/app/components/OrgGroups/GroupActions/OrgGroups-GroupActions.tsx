import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { OrgActions } from '../../OrgActions/OrgActions';
import { type CrgGroupExtended } from '../OrgGroups.models';

const cnOrgGroupsGroupActions = cn('OrgGroups', 'GroupActions');

interface OrgGroupsGroupActionsProps {
  rowData: CrgGroupExtended;
}

export const OrgGroupsGroupActions: FC<OrgGroupsGroupActionsProps> = ({ rowData }) => (
  <OrgActions className={cnOrgGroupsGroupActions()} group={rowData} />
);
