import React, { type ReactNode } from 'react';
import { FolderOutlined, MapOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { type CrgProject } from '../../../services/gis/projects/projects.models';
import { type XTableCustomCellProps } from '../../XTable/XTable.models';

import './PermissionsListDialog-ProjectIcon.scss';

const cnPermissionsListProjectIcon = cn('PermissionsListDialog', 'ProjectIcon');

export function PermissionsListProjectIcon({ rowData }: Readonly<XTableCustomCellProps<CrgProject>>): ReactNode {
  const Icon = rowData.folder ? FolderOutlined : MapOutlined;

  return <Icon className={cnPermissionsListProjectIcon()} color='primary' fontSize='small' />;
}
