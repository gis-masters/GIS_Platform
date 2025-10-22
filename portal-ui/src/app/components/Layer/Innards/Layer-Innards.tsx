import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { type ChildrenProps } from '../../../services/models';
import { LayerGap } from '../Gap/Layer-Gap';
import { LayerInnardsInner } from '../InnardsInner/Layer-InnardsInner';

import './Layer-Innards.scss';

const cnLayerInnards = cn('Layer', 'Innards');

interface LayerInnardsProps extends ChildrenProps {
  show: boolean;
  depth: number;
}

export const LayerInnards: FC<LayerInnardsProps> = ({ show, depth, children }) => (
  <>
    {show ? (
      <div className={cnLayerInnards()}>
        <LayerGap gap={depth} />
        <LayerInnardsInner>{children}</LayerInnardsInner>
      </div>
    ) : null}
  </>
);
