import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';

import '!style-loader!css-loader!sass-loader!./PrintDialog-ExtraIcon.scss';

const cnPrintDialogExtraIcon = cn('PrintDialog', 'ExtraIcon');

interface PrintDialogExtraIconProps {
  open: boolean;
}

export const PrintDialogExtraIcon: FC<PrintDialogExtraIconProps> = ({ open }) => {
  const ExtraIcon = open ? ArrowDropUp : ArrowDropDown;

  return <ExtraIcon className={cnPrintDialogExtraIcon()} />;
};
