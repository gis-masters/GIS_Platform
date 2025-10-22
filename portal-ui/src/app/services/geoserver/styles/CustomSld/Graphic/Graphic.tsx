import { createElement, type FC } from 'react';

import { type ChildrenProps } from '../../../../models';

export const Graphic: FC<ChildrenProps> = ({ children }) => createElement('Graphic', {}, children);
