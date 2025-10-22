import { createElement, type FC } from 'react';

import { type ChildrenProps } from '../../../../models';

export const Radius: FC<ChildrenProps> = ({ children }) => createElement('Radius', {}, children);
