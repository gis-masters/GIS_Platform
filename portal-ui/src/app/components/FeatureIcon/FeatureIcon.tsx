import React, { FC } from 'react';
import { Adjust, PolylineOutlined, SvgIconComponent } from '@mui/icons-material';

import { GeometryType } from '../../services/geoserver/wfs.models';
import { Shape } from '../Icons/Shape';

interface FeatureIconProps {
  geometryType: GeometryType;
  className: string;
}

export const FeatureIcon: FC<FeatureIconProps> = ({ geometryType, className }) => {
  if (!geometryType) {
    return;
  }

  let Icon: SvgIconComponent;

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
  }

  return <Icon className={className} color='primary' />;
};
