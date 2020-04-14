import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { LayerInnardsInner } from '../InnardsInner/Layer-InnardsInner';
import { LayerGap } from '../Gap/Layer-Gap';

import '!style-loader!css-loader!sass-loader!./Layer-Innards.scss';

const cnLayerInnards = cn('Layer', 'Innards');

interface LayerInnardsProps {
  show: boolean;
  depth: number;
}

export const LayerInnards: FC<LayerInnardsProps> = ({ show, depth, children }) => (
  <>
    {show ? (
      <div className={cnLayerInnards()}>
        <LayerGap gap={depth} />
        <LayerInnardsInner>
          {children}
        </LayerInnardsInner>
      </div>
    ) : null}
  </>
);
