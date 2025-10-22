import { createElement, type FC } from 'react';

import { type ChildrenProps } from '../../../../models';

export const LineSymbolizer: FC<ChildrenProps> = ({ children }) => createElement('LineSymbolizer', {}, children);
