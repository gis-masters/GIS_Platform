import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./Attributes-BarHeadGap.scss';

const cnAttributesBarHeadGap = cn('Attributes', 'BarHeadGap');

export const AttributesBarHeadGap: FC = () => <div className={cnAttributesBarHeadGap()} />;
