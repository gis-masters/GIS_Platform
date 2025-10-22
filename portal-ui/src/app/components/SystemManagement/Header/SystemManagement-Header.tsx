import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { User } from '../../User/User';

import './SystemManagement-Header.scss';

const cnSystemManagementHeader = cn('SystemManagement', 'Header');

export const SystemManagementHeader: FC = () => (
  <div className={cnSystemManagementHeader('Header')}>
    <User />
  </div>
);
