import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { CrgLayer, CrgLayersGroup, CrgLayerType } from '../../../services/gis/layers/layers.models';
import { LayerIconType } from '../../LayerIcon/LayerIcon.base';
import { LayerIcon as Icon } from '../../LayerIcon/LayerIcon.composed';

import '!style-loader!css-loader!sass-loader!./Layer-Icon.scss';

const cnLayerIcon = cn('Layer', 'Icon');

interface LayerIconProps {
  expanded: boolean;
  isGroup: boolean;
  isError: boolean;
  data: CrgLayer | CrgLayersGroup;
}

export const LayerIcon: FC<LayerIconProps> = ({ data, isGroup, isError, expanded }) => {
  let iconType: LayerIconType;
  const layer = data as CrgLayer;

  if (isError) {
    iconType = 'error';
  } else if (isGroup) {
    iconType = 'group';
  } else {
    switch (layer.type) {
      case CrgLayerType.RASTER: {
        iconType = 'raster';

        break;
      }
      case CrgLayerType.VECTOR: {
        iconType = 'vector';

        break;
      }
      case CrgLayerType.DXF: {
        iconType = 'dxf';

        break;
      }
      case CrgLayerType.TAB: {
        iconType = 'tab';

        break;
      }
      case CrgLayerType.MID: {
        iconType = 'mid';

        break;
      }
      case CrgLayerType.SHP: {
        iconType = 'shp';

        break;
      }
      default: {
        iconType = 'unknown';
      }
    }
  }

  return <Icon type={iconType} className={cnLayerIcon()} layer={layer} expanded={expanded} />;
};
