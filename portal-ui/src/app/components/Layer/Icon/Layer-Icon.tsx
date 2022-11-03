import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { CrgLayer, CrgLayersGroup, CrgLayerType, CrgVectorLayer } from '../../../services/gis/projects.models';
import { LayerIcon as Icon } from '../../LayerIcon/LayerIcon.composed';
import { LayerIconType } from '../../LayerIcon/LayerIcon';

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
  let schemaId: string;

  if (isError) {
    iconType = 'error';
  } else if (isGroup) {
    iconType = 'group';
  } else if ((data as CrgLayer).type === CrgLayerType.RASTER) {
    iconType = 'raster';
  } else if ((data as CrgLayer).type === CrgLayerType.VECTOR) {
    iconType = 'vector';
  } else if ((data as CrgLayer).type === CrgLayerType.VECTOR_FROM_FILE) {
    iconType = 'vectorFromFile';
  } else {
    iconType = 'unknown';
  }

  if (!isGroup) {
    schemaId = (data as CrgVectorLayer).schemaId;
  }

  return <Icon type={iconType} className={cnLayerIcon()} schemaId={schemaId} expanded={expanded} />;
};
