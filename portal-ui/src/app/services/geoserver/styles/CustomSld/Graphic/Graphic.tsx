import { createElement, FC } from 'react';

import { ChildrenProps } from '../../../../models';

export const Graphic: FC<ChildrenProps> = ({ children }) => createElement('Graphic', {}, children);
