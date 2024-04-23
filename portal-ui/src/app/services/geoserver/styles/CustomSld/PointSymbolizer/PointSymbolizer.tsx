import { createElement, FC } from 'react';

import { ChildrenProps } from '../../../../models';

export const PointSymbolizer: FC<ChildrenProps> = ({ children }) => createElement('PointSymbolizer', {}, children);
