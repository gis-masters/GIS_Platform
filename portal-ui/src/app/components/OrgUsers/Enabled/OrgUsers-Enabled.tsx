import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { CrgUserExtended } from '../OrgUsers';
import { Block, Done } from '@material-ui/icons';

const cnOrgUsersEnabled = cn('OrgUsers', 'Enabled');

interface OrgUsersEnabledProps {
  rowData: CrgUserExtended;
}

export const OrgUsersEnabled: FC<OrgUsersEnabledProps> = ({ rowData }) => {
  const Icon = rowData.enabled ? Done : Block;

  return <Icon className={cnOrgUsersEnabled()} />;
};
