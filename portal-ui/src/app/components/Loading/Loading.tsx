import React, { FC } from 'react';
import { CircularProgress } from '@mui/material';
import { cn } from '@bem-react/classname';

const cnLoading = cn('Loading');

import '!style-loader!css-loader!sass-loader!./Loading.scss';

interface LoadingProps {
  visible?: boolean;
  className?: string;
  noBackdrop?: boolean;
  size?: number;
  global?: boolean;
  value?: number;
}

export const Loading: FC<LoadingProps> = ({ visible, className, noBackdrop, size, global, value }) => {
  if (visible === false) {
    return null;
  }

  return (
    <div className={cnLoading({ noBackdrop, global }, [className])}>
      <CircularProgress
        size={size || 100}
        value={value}
        variant={typeof value === 'number' ? 'determinate' : 'indeterminate'}
      />
    </div>
  );
};
