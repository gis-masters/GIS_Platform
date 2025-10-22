import { createElement, type FC } from 'react';

import { type ChildrenProps } from '../../../../models';

export const AnchorPointX: FC<ChildrenProps> = ({ children }) => createElement('AnchorPointX', {}, children);
