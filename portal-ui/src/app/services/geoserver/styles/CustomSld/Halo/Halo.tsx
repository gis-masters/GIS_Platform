import { createElement, FC } from 'react';

import { ChildrenProps } from '../../../../models';

export const Halo: FC<ChildrenProps> = ({ children }) => createElement('Halo', {}, children);
