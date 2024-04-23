import React from 'react';
import { Folder, FolderOpen } from '@mui/icons-material';
import { withBemMod } from '@bem-react/core';

import { cnLayerIcon, LayerIconProps } from '../LayerIcon.base';

interface LayerIconTypeGroupProps {
  type: 'group';
  expanded?: boolean;
}

export const withTypeGroup = withBemMod<LayerIconTypeGroupProps, LayerIconProps>(
  cnLayerIcon(),
  { type: 'group' },
  () =>
    ({ expanded, className, colorized, size }) => {
      const Icon = expanded ? FolderOpen : Folder;

      return (
        <Icon className={cnLayerIcon(null, [className])} fontSize={size} color={colorized ? 'primary' : 'inherit'} />
      );
    }
);
