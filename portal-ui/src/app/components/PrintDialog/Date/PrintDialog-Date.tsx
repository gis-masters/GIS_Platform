import React, { CSSProperties, FC } from 'react';
import { cn } from '@bem-react/classname';
import moment from 'moment';

import '!style-loader!css-loader!sass-loader!./PrintDialog-Date.scss';

const cnPrintDialogDate = cn('PrintDialog', 'Date');

interface PrintDialogDateProps {
  forPrint?: boolean;
  resolution?: number;
}

export const PrintDialogDate: FC<PrintDialogDateProps> = ({ forPrint, resolution }) => {
  moment.locale('ru');

  return (
    <div
      className={cnPrintDialogDate({ forPrint })}
      style={{ '--PrintDialogDateResolution': resolution } as CSSProperties}
    >
      {moment().format('L')}
    </div>
  );
};
