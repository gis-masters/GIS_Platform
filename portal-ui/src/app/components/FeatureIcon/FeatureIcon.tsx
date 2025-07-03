import React, { FC } from 'react';
import { Tooltip } from '@mui/material';
import { Adjust, PolylineOutlined, SvgIconComponent, WarningAmberOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { GeometryType } from '../../services/geoserver/wfs/wfs.models';
import { services } from '../../services/services';
import { Shape } from '../Icons/Shape';

import '!style-loader!css-loader!sass-loader!./FeatureIcon.scss';

const cnFeatureIcon = cn('FeatureIcon');

interface FeatureIconProps {
  geometryType: GeometryType | undefined;
  className?: string;
}

export const FeatureIcon: FC<FeatureIconProps> = ({ geometryType, className }) => {
  let error = false;
  let Icon: SvgIconComponent;
  let tooltip: string = `Тип геометрии: ${geometryType} не поддерживается`;

  switch (geometryType) {
    case GeometryType.POLYGON: {
      tooltip = 'Тип геометрии: полигон';
      Icon = Shape;
      break;
    }
    case GeometryType.MULTI_POLYGON: {
      tooltip = 'Тип геометрии: мультиполигон';
      Icon = Shape;
      break;
    }
    case GeometryType.LINE_STRING:
    case GeometryType.MULTI_LINE_STRING: {
      tooltip = 'Тип геометрии: линия';
      Icon = PolylineOutlined;
      break;
    }
    case GeometryType.POINT:
    case GeometryType.MULTI_POINT: {
      tooltip = 'Тип геометрии: точка';
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

  return (
    <Tooltip title={tooltip}>
      <span>{error ? <span>{icon}</span> : icon}</span>
    </Tooltip>
  );
};
