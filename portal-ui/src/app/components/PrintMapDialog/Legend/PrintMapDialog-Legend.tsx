import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { printSettings } from '../../../stores/PrintSettings.store';
import { Legend } from '../../Legend/Legend';

import '!style-loader!css-loader!sass-loader!./PrintMapDialog-Legend.scss';

const cnPrintMapDialogLegend = cn('PrintMapDialog', 'Legend');

export const PrintMapDialogLegend: FC = observer(() => {
  const { legend, resolution, pageFormatId, legendSize } = printSettings;
  const formatsResizes: Record<string, number> = { a5: 0.41, a4: 0.304, a3: 0.22, square: 0.35 };
  const resizeForPageFormat = formatsResizes[pageFormatId];

  return (
    <Legend
      className={cnPrintMapDialogLegend()}
      rules={legend.items}
      forPrint
      resolution={resolution}
      resize={resizeForPageFormat * legendSize * 1.3}
      cleanDuplicates
    />
  );
});
