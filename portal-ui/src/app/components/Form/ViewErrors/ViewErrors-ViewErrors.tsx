import React, { FC } from 'react';
import { Tooltip } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./ViewErrors-ViewErrors.scss';

const cnFormViewErrors = cn('Form', 'ViewErrors');

interface FormViewErrorsProps {
  errors?: string[];
}

export const FormViewErrors: FC<FormViewErrorsProps> = ({ errors = [] }) =>
  errors.length > 0 && (
    <Tooltip title={errors.join('\n')} className={cnFormViewErrors()}>
      <span>
        <ErrorOutline color='error' />
      </span>
    </Tooltip>
  );
