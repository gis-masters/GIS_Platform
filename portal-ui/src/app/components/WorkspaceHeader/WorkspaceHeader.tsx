import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { Favicon } from '../Favicon/Favicon';

import { WorkspaceHeaderBurger } from './Burger/WorkspaceHeader-Burger';
import { WorkspaceHeaderOrganisation } from './Organisation/WorkspaceHeader-Organisation';
import { WorkspaceHeaderBreadcrumbs } from './Breadcrumbs/WorkspaceHeader-Breadcrumbs';
import { WorkspaceHeaderButtons } from './Buttons/WorkspaceHeader-Buttons';
import { WorkspaceHeaderLoader } from './Loader/WorkspaceHeader-Loader';

import '!style-loader!css-loader!sass-loader!./WorkspaceHeader.scss';

const cnWorkspaceHeader = cn('WorkspaceHeader');

export const WorkspaceHeader: FC = () => (
  <div className={cnWorkspaceHeader()}>
    <Favicon />
    <WorkspaceHeaderBurger />
    <WorkspaceHeaderOrganisation />
    <WorkspaceHeaderBreadcrumbs />
    <WorkspaceHeaderButtons />
    <WorkspaceHeaderLoader />
  </div>
);
