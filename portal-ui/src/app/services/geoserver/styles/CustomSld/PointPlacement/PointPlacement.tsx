import { createElement, FC } from 'react';

import { ChildrenProps } from '../../../../models';

export const PointPlacement: FC<ChildrenProps> = ({ children }) => createElement('PointPlacement', {}, children);
