import { createElement, type FC } from 'react';

import { type ChildrenProps } from '../../../../models';

export const PointPlacement: FC<ChildrenProps> = ({ children }) => createElement('PointPlacement', {}, children);
