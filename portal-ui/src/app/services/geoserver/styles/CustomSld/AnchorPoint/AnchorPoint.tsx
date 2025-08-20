import { createElement, FC } from 'react';

import { ChildrenProps } from '../../../../models';

export const AnchorPoint: FC<ChildrenProps> = ({ children }) => createElement('AnchorPoint', {}, children);
