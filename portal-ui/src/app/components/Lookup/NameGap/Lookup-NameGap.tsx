import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { type ChildrenProps } from '../../../services/models';

import './Lookup-NameGap.scss';

const cnLookupNameGap = cn('Lookup', 'NameGap');

export const LookupNameGap: FC<ChildrenProps> = ({ children }) => <div className={cnLookupNameGap()}>{children}</div>;
