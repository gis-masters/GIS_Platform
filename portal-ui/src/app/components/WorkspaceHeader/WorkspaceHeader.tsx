import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { Favicon } from '../Favicon/Favicon';
import { WorkspaceHeaderBreadcrumbs } from './Breadcrumbs/WorkspaceHeader-Breadcrumbs';
import { WorkspaceHeaderButtons } from './Buttons/WorkspaceHeader-Buttons';
import { WorkspaceHeaderLoader } from './Loader/WorkspaceHeader-Loader';
import { WorkspaceHeaderMenu } from './Menu/WorkspaceHeader-Menu';
import { WorkspaceHeaderOrganization } from './Organization/WorkspaceHeader-Organization';

import '!style-loader!css-loader!sass-loader!./WorkspaceHeader.scss';

const cnWorkspaceHeader = cn('WorkspaceHeader');

export const WorkspaceHeader: FC = () => (
  <div className={cnWorkspaceHeader()}>
    <Favicon />
    <WorkspaceHeaderMenu />
    <WorkspaceHeaderOrganization />
    <WorkspaceHeaderBreadcrumbs />
    <WorkspaceHeaderButtons />
    <WorkspaceHeaderLoader />
  </div>
);
