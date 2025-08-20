import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { FiasValue } from '../../services/data/fias/fias.models';
import { FilterQuery, FilterQueryValue } from '../../services/util/filters/filters.models';
import { Highlight } from '../Highlight/Highlight';

const cnFiasView = cn('FiasView');

interface FiasViewProps {
  value?: FiasValue;
  word?: FilterQuery | FilterQueryValue | FilterQuery[];
}

export const FiasView: FC<FiasViewProps> = ({ value, word }) => {
  const address =
    word && value?.address ? (
      <Highlight word={word} enabled>
        {value.address}
      </Highlight>
    ) : (
      value?.address
    );

  return (
    <div className={cnFiasView()}>
      {value?.address ? (
        <>
          {address} {value.oktmo ? `ОКТМО: ${value.oktmo}` : ''} {value.id ? `Код фиас: ${value.id}` : ''}
        </>
      ) : (
        '—'
      )}
    </div>
  );
};
