import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { SystemManagementHeader } from './Header/SystemManagement-Header';
import { SystemManagementContent } from './Content/SystemManagement-Content';

const cnSystemManagement = cn('SystemManagement');

export const SystemManagement: FC = () => (
  <div className={cnSystemManagement()}>
    <SystemManagementHeader />
    <SystemManagementContent />
  </div>
);
