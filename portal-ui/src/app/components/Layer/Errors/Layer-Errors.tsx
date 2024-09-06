import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import * as DOMPurify from 'dompurify';

import '!style-loader!css-loader!sass-loader!./Layer-Errors.scss';

const cnLayerErrors = cn('Layer', 'Errors');

interface LayerErrorsProps {
  errors: string[];
}

export const LayerErrors: FC<LayerErrorsProps> = ({ errors }) => (
  <div className={cnLayerErrors()}>
    {!!errors.length &&
      errors.map((error, i) => <div key={i} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(error) }} />)}
    {!errors.length && 'Ошибка получения данных'}
  </div>
);
