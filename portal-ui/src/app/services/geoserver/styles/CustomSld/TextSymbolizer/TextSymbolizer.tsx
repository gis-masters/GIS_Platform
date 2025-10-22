import { createElement, type FC } from 'react';

import { type ChildrenProps } from '../../../../models';

export const TextSymbolizer: FC<ChildrenProps> = ({ children }) => createElement('TextSymbolizer', {}, children);
