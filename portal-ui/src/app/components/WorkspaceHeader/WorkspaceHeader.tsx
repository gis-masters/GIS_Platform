import React, { Component } from 'react';
import { cn } from '@bem-react/classname';

import { WorkspaceHeaderBurger } from './Burger/WorkspaceHeader-Burger';
import { WorkspaceHeaderOrganisation } from './Organisation/WorkspaceHeader-Organisation';
import { WorkspaceHeaderBreadcrumbs } from './Breadcrumbs/WorkspaceHeader-Breadcrumbs';
import { WorkspaceHeaderButtons } from './Buttons/WorkspaceHeader-Buttons';

import '!style-loader!css-loader!sass-loader!./WorkspaceHeader.scss';

const cnWorkspaceHeader = cn('WorkspaceHeader');

export class WorkspaceHeader extends Component {
  render() {
    return (
      <div className={cnWorkspaceHeader()}>
        <WorkspaceHeaderBurger />
        <WorkspaceHeaderOrganisation />
        <WorkspaceHeaderBreadcrumbs />
        <WorkspaceHeaderButtons />
      </div>
    );
  }
}
