import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import moment from 'moment';

import '!style-loader!css-loader!sass-loader!./PrintMapDialog-Date.scss';

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
