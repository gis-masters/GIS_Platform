import React, { FC } from 'react';
import { CircularProgress } from '@material-ui/core';
import { cn } from '@bem-react/classname';

const cnLoading = cn('Loading');

import '!style-loader!css-loader!sass-loader!./Loading.scss';

interface LoadingProps {
  visible?: boolean;
  className?: string;
  noBackdrop?: boolean;
  size?: number;
  global?: boolean;
}

export const Loading: FC<LoadingProps> = ({ visible, className, noBackdrop, size, global }) => {
  if (visible === false) {
    return null;
  }

  return (
    <div className={cnLoading({ noBackdrop, global }, [className])}>
      <CircularProgress size={size ? size : 100} />
    </div>
  );
};
