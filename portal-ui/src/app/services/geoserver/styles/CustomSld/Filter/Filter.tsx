import { createElement, type FC } from 'react';

import { type ChildrenProps } from '../../../../models';

export const Filter: FC<ChildrenProps> = ({ children }) => createElement('Filter', {}, children);
