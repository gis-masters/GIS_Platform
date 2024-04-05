import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { ArrowRight } from '@mui/icons-material';

import { HelpTocTitleIcon } from '../TitleIcon/HelpToc-TitleIcon';

const cnHelpTocExpandIcon = cn('HelpToc', 'ExpandIcon');

export const HelpTocExpandIcon: FC = () => <HelpTocTitleIcon className={cnHelpTocExpandIcon()} Icon={ArrowRight} />;
