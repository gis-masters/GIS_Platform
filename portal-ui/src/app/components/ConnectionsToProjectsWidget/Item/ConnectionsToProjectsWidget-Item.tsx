import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { CrgProject } from '../../../services/crg/projects.models';
import { Link } from '../../Link/Link';

import '!style-loader!css-loader!sass-loader!./ConnectionsToProjectsWidget-Item.scss';

const cnConnectionsToProjectsWidgetItem = cn('ConnectionsToProjectsWidget', 'Item');

interface ConnectionsToProjectsWidgetItemProps {
  project: CrgProject;
}

export const TableManagementWidgetItem: FC<ConnectionsToProjectsWidgetItemProps> = ({ project }) => (
  <Link className={cnConnectionsToProjectsWidgetItem()} url={`/projects/${project.id}/map`}>
    {project.name}
  </Link>
);
