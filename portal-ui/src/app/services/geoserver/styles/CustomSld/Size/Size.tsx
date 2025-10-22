import { createElement, type FC } from 'react';

import { type ChildrenProps } from '../../../../models';

export const Size: FC<ChildrenProps> = ({ children }) => createElement('Size', {}, children);
