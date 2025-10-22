import { createElement, type FC } from 'react';

import { type ChildrenProps } from '../../../../models';

export const Halo: FC<ChildrenProps> = ({ children }) => createElement('Halo', {}, children);
