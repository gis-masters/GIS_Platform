import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./Lookup-NameGap.scss';

const cnLookupNameGap = cn('Lookup', 'NameGap');

export const LookupNameGap: FC<ChildrenProps> = ({ children }) => <div className={cnLookupNameGap()}>{children}</div>;
