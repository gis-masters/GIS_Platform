import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { CrgProject } from '../../../services/crg/projects.models';
import { Link } from '../../Link/Link';

import '!style-loader!css-loader!sass-loader!./ConnectionsToProjectsWidget-Link.scss';

const cnConnectionsToProjectsWidgetLink = cn('ConnectionsToProjectsWidget', 'Link');

interface ConnectionsToProjectsWidgetLinkProps {
  project: CrgProject;
}

export const ConnectionsToProjectsWidgetLink: FC<ConnectionsToProjectsWidgetLinkProps> = ({ project }) => (
  <Link className={cnConnectionsToProjectsWidgetLink()} href={`/projects/${project.id}/map`}>
    {project.name}
  </Link>
);
