import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { FormError } from '../Error/Form-Error';

import './Form-Errors.scss';

const cnFormErrors = cn('Form', 'Errors');

interface FormErrorsProps {
  errors?: string[];
  warnings?: string[];
  inHelperText?: boolean;
}

export const FormErrors: FC<FormErrorsProps> = ({ errors, warnings, inHelperText }) => {
  const contents = inHelperText && !warnings?.length;

  return (
    !!(errors?.length || warnings?.length) && (
      <div className={cnFormErrors({ contents })}>
        {warnings?.map((warning, i) => (
          <FormError key={`w-${i}`} warning>
            {warning}
          </FormError>
        ))}
        {errors?.map((error, i) => (
          <FormError key={`e-${i}`} contents={contents}>
            {error}
          </FormError>
        ))}
      </div>
    )
  );
};
