import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { SearchOutlined } from '@mui/icons-material';

const cnHelpTocSearchIcon = cn('HelpToc', 'SearchIcon');

export const HelpTocSearchIcon: FC = () => <SearchOutlined className={cnHelpTocSearchIcon()} />;
