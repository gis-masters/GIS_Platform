import { createElement, type FC } from 'react';

import { type ChildrenProps } from '../../../../models';

export const PointSymbolizer: FC<ChildrenProps> = ({ children }) => createElement('PointSymbolizer', {}, children);
