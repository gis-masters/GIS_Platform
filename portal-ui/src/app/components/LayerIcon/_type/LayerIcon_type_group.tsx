import React from 'react';
import { withBemMod } from '@bem-react/core';
import { Folder, FolderOpen } from '@material-ui/icons';

import { LayerIconProps, cnLayerIcon } from '../LayerIcon';

interface LayerIconTypeGroupProps {
  type: 'group';
  expanded: boolean;
}

export const withTypeGroup = withBemMod<LayerIconTypeGroupProps, LayerIconProps>(
  cnLayerIcon(),
  { type: 'group' },
  () => ({ expanded, className, colorized }) => {
    const Icon = expanded ? FolderOpen : Folder;

    return <Icon className={cnLayerIcon(null, [className])} color={colorized ? 'primary' : null} />;
  }
);
