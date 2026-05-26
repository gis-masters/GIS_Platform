import React, { type FC } from 'react';
import { Tooltip } from '@mui/material';
import { WarningAmber } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import './Form-ViewWarnings.scss';

const cnFormViewWarnings = cn('Form', 'ViewWarnings');

interface FormViewWarningsProps {
  warnings?: string[];
}

export const FormViewWarnings: FC<FormViewWarningsProps> = ({ warnings = [] }) =>
  warnings.length > 0 && (
    <Tooltip title={warnings.join('\n')} className={cnFormViewWarnings()}>
      <span>
        <WarningAmber color='warning' />
      </span>
    </Tooltip>
  );
