import { createElement, type FC } from 'react';

import { type ChildrenProps } from '../../../../models';

export const Stroke: FC<ChildrenProps> = ({ children }) => createElement('Stroke', {}, children);
