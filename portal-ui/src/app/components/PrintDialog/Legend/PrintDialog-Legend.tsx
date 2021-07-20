import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { printSettings } from '../../../stores/PrintSettings.store';
import { Legend } from '../../Legend/Legend';

import '!style-loader!css-loader!sass-loader!./PrintDialog-Legend.scss';

const cnPrintDialogLegend = cn('PrintDialog', 'Legend');

export const PrintDialogLegend: FC = () => {
  const { legend, resolution, pageFormatId } = printSettings;
  const formatsResizes: Record<string, number> = { a5: 0.41, a4: 0.304, a3: 0.22 };
  const resizeForPageFormat = formatsResizes[pageFormatId];

  return (
    <Legend
      className={cnPrintDialogLegend()}
      rules={legend.items}
      forPrint
      resolution={resolution}
      resize={resizeForPageFormat}
    />
  );
};
