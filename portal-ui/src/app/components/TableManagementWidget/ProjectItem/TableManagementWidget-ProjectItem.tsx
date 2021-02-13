import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { CrgProject } from '../../../services/crg/projects.models';
import { Link } from '../../Link/Link';

import '!style-loader!css-loader!sass-loader!./TableManagementWidget-ProjectItem.scss';

const cnTableManagementWidgetProjectItem = cn('TableManagementWidget', 'ProjectItem');

interface TableManagementWidgetProjectItemProps {
  project: CrgProject;
}

export const TableManagementWidgetProjectItem: FC<TableManagementWidgetProjectItemProps> = ({ project }) => (
  <Link className={cnTableManagementWidgetProjectItem()} url={`/projects/${project.id}/map`}>
    {project.name}
  </Link>
);
