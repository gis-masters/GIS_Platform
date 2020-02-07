import React from 'react';
import { CircularProgress } from '@material-ui/core';
import { cn } from '@bem-react/classname';

const cnLoading = cn('Loading');

import '!style-loader!css-loader!sass-loader!./Loading.scss';

interface LoadingProps {
  visible?: boolean;
  className?: string;
  noBackdrop?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({ visible, className, noBackdrop }) => {
  if (visible === false) {
    return null;
  }
  return (
    <div className={cnLoading({noBackdrop}, [className])}>
      <CircularProgress size={100} />
    </div>
  );
};
