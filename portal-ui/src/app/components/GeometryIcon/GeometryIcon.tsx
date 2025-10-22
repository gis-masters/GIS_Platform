import React, { type FC } from 'react';
import { type SvgIconProps } from '@mui/material';
import { Adjust, PolylineOutlined, ReportProblemOutlined, type SvgIconComponent } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { type IClassNameProps } from '@bem-react/core';

import { GeometryType } from '../../services/geoserver/wfs/wfs.models';
import { Shape } from '../Icons/Shape';

const cnGeometryIcon = cn('GeometryIcon');

interface GeometryIconProps extends IClassNameProps {
  geometryType?: GeometryType;
  colorized?: boolean;
  size?: SvgIconProps['fontSize'];
}

export const GeometryIcon: FC<GeometryIconProps> = ({ geometryType, colorized, size, className }) => {
  let Icon: SvgIconComponent;
  let htmlColor: string = '';

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
      Icon = ReportProblemOutlined;
      htmlColor = '#ffc107';
    }
  }

  return (
    <Icon
      className={cnGeometryIcon(null, [className])}
      color={colorized && !htmlColor ? 'primary' : 'inherit'}
      htmlColor={colorized && htmlColor ? htmlColor : ''}
      fontSize={size}
    />
  );
};
