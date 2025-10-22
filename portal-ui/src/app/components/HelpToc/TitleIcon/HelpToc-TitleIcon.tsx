import React, { type FC } from 'react';
import { type SvgIconComponent } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { type IClassNameProps } from '@bem-react/core';

import './HelpToc-TitleIcon.scss';

const cnHelpToc = cn('HelpToc');

interface HelpTocTitleIconProps extends IClassNameProps {
  Icon: SvgIconComponent;
}

export const HelpTocTitleIcon: FC<HelpTocTitleIconProps> = ({ Icon, className }) => (
  <Icon className={cnHelpToc('TitleIcon', [className])} />
);
