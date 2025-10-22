import { createElement, type FC } from 'react';

import { type ChildrenProps } from '../../../../models';

export const GraphicFill: FC<ChildrenProps> = ({ children }) => createElement('GraphicFill', {}, children);
