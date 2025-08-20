import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { SystemManagementContent } from './Content/SystemManagement-Content';
import { SystemManagementHeader } from './Header/SystemManagement-Header';

import '!style-loader!css-loader!sass-loader!./SystemManagement.scss';

const cnSystemManagement = cn('SystemManagement');

export const SystemManagement: FC = () => (
  <div className={cnSystemManagement()}>
    <SystemManagementHeader />
    <SystemManagementContent />
  </div>
);
