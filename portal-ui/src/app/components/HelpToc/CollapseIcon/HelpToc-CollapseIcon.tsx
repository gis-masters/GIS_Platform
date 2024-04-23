import React, { FC } from 'react';
import { ArrowDropDown } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { HelpTocTitleIcon } from '../TitleIcon/HelpToc-TitleIcon';

const cnHelpTocCollapseIcon = cn('HelpToc', 'CollapseIcon');

export const HelpTocCollapseIcon: FC = () => (
  <HelpTocTitleIcon className={cnHelpTocCollapseIcon()} Icon={ArrowDropDown} />
);
