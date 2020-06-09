import React, { Component } from 'react';
import { cn } from '@bem-react/classname';

import { ManagerHeader } from './Header/Manager-Header';
import { ManagerBody } from './Body/Manager-Body';

const cnManager = cn('Manager');

export class ContentManager extends Component {
  render() {
    return (
      <div className={cnManager()}>
        <ManagerHeader />
        <ManagerBody />
      </div>
    );
  }
}
