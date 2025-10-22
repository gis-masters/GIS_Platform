import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';
import moment from 'moment';

import './PrintMapDialog-Date.scss';

const cnPrintMapDialogDate = cn('PrintMapDialog', 'Date');

interface PrintMapDialogDateProps {
  forPrint?: boolean;
  resolution?: number;
}

export const PrintMapDialogDate: FC<PrintMapDialogDateProps> = ({ forPrint, resolution }) => (
  <div className={cnPrintMapDialogDate({ forPrint })} style={{ '--PrintMapDialogDateResolution': resolution || '' }}>
    {moment().format('L')}
  </div>
);
