import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { OrganizationsListItemInfo } from '../../../services/auth/auth/auth.models';
import { LoginFormOrgSelectClose } from '../OrgSelectClose/LoginForm-OrgSelectClose';
import { LoginFormOrgSelectHead } from '../OrgSelectHead/LoginForm-OrgSelectHead';
import { LoginFormOrgSelectList } from '../OrgSelectList/LoginForm-OrgSelectList';
import { LoginFormOrgSelectTitle } from '../OrgSelectTitle/LoginForm-OrgSelectTitle';

import '!style-loader!css-loader!sass-loader!./LoginForm-OrgSelect.scss';

const cnLoginFormOrgSelect = cn('LoginForm', 'OrgSelect');

interface LoginFormOrgSelectProps {
  organizations: OrganizationsListItemInfo[];
  onSelect(orgId: number): void;
  onClose(): void;
}

export const LoginFormOrgSelect: FC<LoginFormOrgSelectProps> = ({ organizations, onSelect, onClose }) => (
  <div className={cnLoginFormOrgSelect(null, ['scroll'])}>
    <LoginFormOrgSelectHead>
      <LoginFormOrgSelectClose onClick={onClose} />
      <LoginFormOrgSelectTitle />
    </LoginFormOrgSelectHead>

    <LoginFormOrgSelectList organizations={organizations} onSelect={onSelect} />
  </div>
);
