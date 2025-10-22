import { createElement, type FC } from 'react';

import { type ChildrenProps } from '../../../../models';

export const AnchorPoint: FC<ChildrenProps> = ({ children }) => createElement('AnchorPoint', {}, children);
