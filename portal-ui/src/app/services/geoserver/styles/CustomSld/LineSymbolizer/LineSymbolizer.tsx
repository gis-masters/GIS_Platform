import { createElement, FC } from 'react';

import { ChildrenProps } from '../../../../models';

export const LineSymbolizer: FC<ChildrenProps> = ({ children }) => createElement('LineSymbolizer', {}, children);
