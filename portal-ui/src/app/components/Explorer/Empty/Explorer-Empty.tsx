import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

const cnExplorerEmpty = cn('Explorer', 'Empty');

export const ExplorerEmpty: FC = () => <div className={cnExplorerEmpty()}>пусто</div>;
