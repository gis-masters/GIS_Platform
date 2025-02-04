import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { Tabs } from '@mui/material';
import { cn } from '@bem-react/classname';

import { CrgVectorLayer } from '../../../services/gis/layers/layers.models';
import { AttributesTab } from '../Tab/Attributes-Tab';
import { AttributesZeroTab } from '../ZeroTab/Attributes-ZeroTab';

import '!style-loader!css-loader!sass-loader!./Attributes-Tabs.scss';

const cnAttributesTabs = cn('Attributes', 'Tabs');

interface AttributesTabsProps {
  hard: CrgVectorLayer[];
  soft: CrgVectorLayer[];
  currentLayer: CrgVectorLayer | undefined;
  onTabClose(layer: CrgVectorLayer): void;
  onTabMinimize(layer: CrgVectorLayer): void;
}

export const AttributesTabs: FC<AttributesTabsProps> = observer(
  ({ hard, soft, currentLayer, onTabClose, onTabMinimize }) => {
    const value = [...hard, ...soft].some(item => item.id === currentLayer?.id) ? currentLayer?.id : 0;

    return (
      <Tabs className={cnAttributesTabs()} variant='scrollable' scrollButtons='auto' value={value}>
        <AttributesZeroTab value={0} />
        {hard.map(layer => (
          <AttributesTab
            layer={layer}
            grade='hard'
            key={layer.id}
            onClose={onTabClose}
            onMinimize={onTabMinimize}
            value={layer.id}
          />
        ))}
        {soft.map(layer => (
          <AttributesTab
            layer={layer}
            grade='soft'
            key={layer.id}
            onClose={onTabClose}
            onMinimize={onTabMinimize}
            value={layer.id}
          />
        ))}
      </Tabs>
    );
  }
);
