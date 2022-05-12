import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';

import '!style-loader!css-loader!sass-loader!./PrintMapDialog-ExtraIcon.scss';

const cnPrintMapDialogExtraIcon = cn('PrintMapDialog', 'ExtraIcon');

interface PrintMapDialogExtraIconProps {
  open: boolean;
}

export const PrintMapDialogExtraIcon: FC<PrintMapDialogExtraIconProps> = ({ open }) => {
  const ExtraIcon = open ? ArrowDropUp : ArrowDropDown;

  return <ExtraIcon className={cnPrintMapDialogExtraIcon()} />;
};
