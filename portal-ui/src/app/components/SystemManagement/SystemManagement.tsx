import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { SystemManagementContent } from './Content/SystemManagement-Content';
import { SystemManagementHeader } from './Header/SystemManagement-Header';

import './SystemManagement.scss';

const cnSystemManagement = cn('SystemManagement');

export const SystemManagement: FC = () => (
  <div className={cnSystemManagement()}>
    <SystemManagementHeader />
    <SystemManagementContent />
  </div>
);
