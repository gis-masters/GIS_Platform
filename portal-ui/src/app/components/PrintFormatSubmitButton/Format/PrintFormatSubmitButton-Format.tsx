import React, { type FC, useCallback } from 'react';
import { MenuItem } from '@mui/material';
import { cn } from '@bem-react/classname';

import { type CreateReportRequest } from '../../../services/report/report.models';

const cnPrintFormatSubmitButtonFormat = cn('PrintFormatSubmitButton', 'Format');

export interface PrintFormatSubmitButtonFormatProps {
  format: CreateReportRequest['outputFormat'];
  label: string;
  onSelect: (format: CreateReportRequest['outputFormat']) => void;
}

export const PrintFormatSubmitButtonFormat: FC<PrintFormatSubmitButtonFormatProps> = ({ format, label, onSelect }) => {
  const handleClick = useCallback(() => onSelect(format), [format, onSelect]);

  return (
    <MenuItem className={cnPrintFormatSubmitButtonFormat()} onClick={handleClick}>
      {label}
    </MenuItem>
  );
};
