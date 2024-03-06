import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { Tooltip } from '@mui/material';
import { Adjust, PolylineOutlined, SvgIconComponent, WarningAmberOutlined } from '@mui/icons-material';

import { GeometryType } from '../../services/geoserver/wfs/wfs.models';
import { Shape } from '../Icons/Shape';
import { services } from '../../services/services';

import '!style-loader!css-loader!sass-loader!./FeatureIcon.scss';

const cnFeatureIcon = cn('FeatureIcon');

interface FeatureIconProps {
  geometryType: GeometryType;
  className?: string;
}

export const FeatureIcon: FC<FeatureIconProps> = ({ geometryType, className }) => {
  if (!geometryType) {
    return;
  }

  let Icon: SvgIconComponent;
  let error = false;

  switch (geometryType) {
    case GeometryType.POLYGON:
    case GeometryType.MULTI_POLYGON: {
      Icon = Shape;
      break;
    }
    case GeometryType.LINE_STRING:
    case GeometryType.MULTI_LINE_STRING: {
      Icon = PolylineOutlined;
      break;
    }
    case GeometryType.POINT:
    case GeometryType.MULTI_POINT: {
      Icon = Adjust;
      break;
    }
    default: {
      services.logger.warn(`Тип геометрии: ${geometryType} не поддерживается`);
      error = true;
      Icon = WarningAmberOutlined;
    }
  }

  const icon = <Icon className={cnFeatureIcon(null, [className])} color={error ? 'warning' : 'primary'} />;

  return error ? <Tooltip title={`Тип геометрии: ${geometryType} не поддерживается`}>{icon}</Tooltip> : icon;
};
