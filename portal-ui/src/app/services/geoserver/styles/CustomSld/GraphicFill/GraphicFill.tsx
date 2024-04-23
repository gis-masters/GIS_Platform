import { createElement, FC } from 'react';

import { ChildrenProps } from '../../../../models';

export const GraphicFill: FC<ChildrenProps> = ({ children }) => createElement('GraphicFill', {}, children);
