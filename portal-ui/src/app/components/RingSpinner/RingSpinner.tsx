import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

const cnRingSpinner = cn('RingSpinner');

import './RingSpinner.scss';

interface RingSpinnerProps {
  className?: string;
  text?: string;
}

export const RingSpinner: FC<RingSpinnerProps> = ({ className, text }) => {
  return (
    <div className={cnRingSpinner(null, [className])}>
      <div className={cnRingSpinner('Spinner')}>
        <div className={cnRingSpinner('Ring', { outer: true })} />
        <div className={cnRingSpinner('Ring', { middle: true })} />
        <div className={cnRingSpinner('Ring', { inner: true })} />
      </div>
      {text && <span className={cnRingSpinner('Text')}>{text}</span>}
    </div>
  );
};
