import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { currentUser } from '../../../stores/CurrentUser.store';

import '!style-loader!css-loader!sass-loader!./WorkspaceHeader-Organization.scss';

const cnWorkspaceHeaderOrganization = cn('WorkspaceHeader', 'Organization');

export const WorkspaceHeaderOrganization: FC = observer(() => (
  <div className={cnWorkspaceHeaderOrganization()}>{currentUser.orgName}</div>
));
