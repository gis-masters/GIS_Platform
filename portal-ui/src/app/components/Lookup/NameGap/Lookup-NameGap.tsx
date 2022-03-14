import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./Lookup-NameGap.scss';

const cnLookupNameGap = cn('Lookup', 'NameGap');

export const LookupNameGap: FC = ({ children }) => <div className={cnLookupNameGap()}>{children}</div>;
