import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { FiasValue } from '../../services/data/fias/fias.models';

const cnFiasView = cn('FiasView');

interface FiasViewProps {
  value: FiasValue;
}

export const FiasView: FC<FiasViewProps> = ({ value }) => (
  <div className={cnFiasView()}>
    {value?.address ? (
      <>
        {value.address} {value.oktmo ? `ОКТМО: ${value.oktmo}` : ''} {value.id ? `Код фиас: ${value.id}` : ''}
      </>
    ) : (
      '—'
    )}
  </div>
);
