import React, { type FC } from 'react';
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import './PrintMapDialog-ExtraIcon.scss';

const cnPrintMapDialogExtraIcon = cn('PrintMapDialog', 'ExtraIcon');

interface PrintMapDialogExtraIconProps {
  open: boolean;
}

export const PrintMapDialogExtraIcon: FC<PrintMapDialogExtraIconProps> = ({ open }) => {
  const ExtraIcon = open ? ArrowDropUp : ArrowDropDown;

  return <ExtraIcon className={cnPrintMapDialogExtraIcon()} />;
};
