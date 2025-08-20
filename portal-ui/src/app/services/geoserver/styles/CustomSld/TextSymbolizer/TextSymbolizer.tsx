import { createElement, FC } from 'react';

import { ChildrenProps } from '../../../../models';

export const TextSymbolizer: FC<ChildrenProps> = ({ children }) => createElement('TextSymbolizer', {}, children);
