import { createElement, FC } from 'react';

import { ChildrenProps } from '../../../../models';

export const AnchorPointX: FC<ChildrenProps> = ({ children }) => createElement('AnchorPointX', {}, children);
