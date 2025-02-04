import React, { FC } from 'react';
import {
  Check,
  Description,
  DescriptionOutlined,
  DeviceHub,
  DeviceHubOutlined,
  Grading,
  GradingOutlined,
  Map,
  MapOutlined
} from '@mui/icons-material';
import { cn } from '@bem-react/classname';

const cnFilesPlacementDialogStepIcon = cn('FilesPlacementDialog', 'StepIcon');

interface FilesPlacementDialogStepIconProps {
  completed: boolean;
  active: boolean;
  error: boolean;
  icon: number;
}

export const FilesPlacementDialogStepIcon: FC<FilesPlacementDialogStepIconProps> = ({ completed, active, icon }) => {
  const Icon = completed
    ? Check
    : [
        [DeviceHub, DeviceHubOutlined],
        [Description, DescriptionOutlined],
        [Map, MapOutlined],
        [Grading, GradingOutlined]
      ][icon - 1][Number(completed)];

  let color: 'primary' | 'success' | 'disabled' = 'disabled';
  if (active && !completed) {
    color = 'primary';
  } else if (completed) {
    color = 'success';
  }

  return (
    <div className={cnFilesPlacementDialogStepIcon()}>
      <Icon fontSize={active && !completed ? 'large' : 'medium'} color={color} />
    </div>
  );
};
