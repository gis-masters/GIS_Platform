import { createElement, type FC } from 'react';

import { type ChildrenProps } from '../../../../models';

export const PolygonSymbolizer: FC<ChildrenProps> = ({ children }) => createElement('PolygonSymbolizer', {}, children);
