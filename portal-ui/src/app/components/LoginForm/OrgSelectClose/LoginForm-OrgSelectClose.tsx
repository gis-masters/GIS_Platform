import React, { type FC } from 'react';
import { WestOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { IconButton } from '../../IconButton/IconButton';

import './LoginForm-OrgSelectClose.scss';

const cnLoginFormOrgSelectClose = cn('LoginForm', 'OrgSelectClose');

interface LoginFormOrgSelectCloseProps {
  onClick(): void;
}

export const LoginFormOrgSelectClose: FC<LoginFormOrgSelectCloseProps> = ({ onClick }) => (
  <IconButton className={cnLoginFormOrgSelectClose()} onClick={onClick}>
    <WestOutlined />
  </IconButton>
);
