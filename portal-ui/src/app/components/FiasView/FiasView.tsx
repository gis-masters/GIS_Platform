import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { Fias } from '../../services/data/fias.service';

const cnFiasView = cn('FiasView');

interface FiasViewProps {
  value: Fias;
}

export const FiasView: FC<FiasViewProps> = ({ value }) => (
  <div className={cnFiasView()}>
    {value?.fullAddress ? (
      <>
        {value.fullAddress} {value.oktmo ? `ОКТМО: ${value.oktmo}` : ''}{' '}
        {value.objectId ? `Код фиас: ${value.objectId}` : ''}
      </>
    ) : (
      '—'
    )}
  </div>
);
