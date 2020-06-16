import React, { FC, Fragment } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./Layer-Errors.scss';

const cnLayerErrors = cn('Layer', 'Errors');

interface LayerErrorsProps {
  errors: string[];
}

export const LayerErrors: FC<LayerErrorsProps> = ({ errors }) => (
  <div className={cnLayerErrors()}>
    {errors.map((error, i) => (
      <Fragment key={i}>
        {error}
        <br />
      </Fragment>
    ))}
  </div>
);
