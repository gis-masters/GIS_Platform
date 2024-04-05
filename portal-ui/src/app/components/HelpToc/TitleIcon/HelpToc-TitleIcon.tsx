import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { SvgIconComponent } from '@mui/icons-material';
import { IClassNameProps } from '@bem-react/core';

import '!style-loader!css-loader!sass-loader!./HelpToc-TitleIcon.scss';

const cnHelpToc = cn('HelpToc');

interface HelpTocTitleIconProps extends IClassNameProps {
  Icon: SvgIconComponent;
}

export const HelpTocTitleIcon: FC<HelpTocTitleIconProps> = ({ Icon, className }) => (
  <Icon className={cnHelpToc('TitleIcon', [className])} />
);
