import React, { FC } from 'react';
import { SearchOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

const cnHelpTocSearchIcon = cn('HelpToc', 'SearchIcon');

export const HelpTocSearchIcon: FC = () => <SearchOutlined className={cnHelpTocSearchIcon()} />;
