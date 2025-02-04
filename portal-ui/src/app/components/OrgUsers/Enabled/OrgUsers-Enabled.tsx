import React, { FC } from 'react';
import { Block, Done } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { CrgUserExtended } from '../OrgUsers';

const cnOrgUsersEnabled = cn('OrgUsers', 'Enabled');

interface OrgUsersEnabledProps {
  rowData: CrgUserExtended;
}

export const OrgUsersEnabled: FC<OrgUsersEnabledProps> = ({ rowData }) => {
  const Icon = rowData.enabled ? Done : Block;

  return <Icon className={cnOrgUsersEnabled()} />;
};
