import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { currentUser } from '../../../stores/CurrentUser.store';

import '!style-loader!css-loader!sass-loader!./WorkspaceHeader-Organisation.scss';

const cnWorkspaceHeaderOrganisation = cn('WorkspaceHeader', 'Organisation');

export const WorkspaceHeaderOrganisation: FC = observer(() => (
  <div className={cnWorkspaceHeaderOrganisation()}>{currentUser.orgName}</div>
));
