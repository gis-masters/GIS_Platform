import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { SystemManagementHeader } from './Header/SystemManagement-Header';
import { SystemManagementContent } from './Content/SystemManagement-Content';

const cnSystemManagement = cn('SystemManagement');

@observer
export class SystemManagement extends Component {
  render() {
    return (
      <div className={cnSystemManagement()}>
        <SystemManagementHeader />
        <SystemManagementContent />
      </div>
    );
  }
}
