import React, { type FC } from 'react';
import { List } from '@mui/material';
import { cn } from '@bem-react/classname';

import { type OrganizationsListItemInfo } from '../../../services/auth/auth/auth.models';
import { LoginFormOrgSelectListItem } from '../OrgSelectListItem/LoginForm-OrgSelectListItem';

import './LoginForm-OrgSelectList.scss';

const cnLoginFormOrgSelectList = cn('LoginForm', 'OrgSelectList');

interface LoginFormOrgSelectListProps {
  organizations: OrganizationsListItemInfo[];
  onSelect(orgId: number): void;
}

export const LoginFormOrgSelectList: FC<LoginFormOrgSelectListProps> = ({ organizations, onSelect }) => (
  <List className={cnLoginFormOrgSelectList(null, ['scroll'])}>
    {organizations.map(organization => (
      <LoginFormOrgSelectListItem key={organization.id} organization={organization} onClick={onSelect} />
    ))}
  </List>
);
