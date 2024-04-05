import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { ArrowDropDown } from '@mui/icons-material';

import { HelpTocTitleIcon } from '../TitleIcon/HelpToc-TitleIcon';

const cnHelpTocCollapseIcon = cn('HelpToc', 'CollapseIcon');

export const HelpTocCollapseIcon: FC = () => (
  <HelpTocTitleIcon className={cnHelpTocCollapseIcon()} Icon={ArrowDropDown} />
);
