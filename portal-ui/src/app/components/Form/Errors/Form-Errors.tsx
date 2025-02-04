import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { FormError } from '../Error/Form-Error';

const cnFormErrors = cn('Form', 'Errors');

interface FormErrorsProps {
  errors?: string[];
}

export const FormErrors: FC<FormErrorsProps> = ({ errors }) =>
  !!errors?.length && (
    <div className={cnFormErrors()}>
      {errors.map((error, i) => (
        <FormError key={i}>{error}</FormError>
      ))}
    </div>
  );
