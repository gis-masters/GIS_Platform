import { createElement, FC } from 'react';

import { ChildrenProps } from '../../../../models';

export const PolygonSymbolizer: FC<ChildrenProps> = ({ children }) => createElement('PolygonSymbolizer', {}, children);
