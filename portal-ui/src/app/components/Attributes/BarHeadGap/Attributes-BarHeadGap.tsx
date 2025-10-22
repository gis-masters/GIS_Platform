import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import './Attributes-BarHeadGap.scss';

const cnAttributesBarHeadGap = cn('Attributes', 'BarHeadGap');

export const AttributesBarHeadGap: FC = () => <div className={cnAttributesBarHeadGap()} />;
