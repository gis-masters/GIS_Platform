import { createElement, FC } from 'react';

import { ChildrenProps } from '../../../../models';

export const Filter: FC<ChildrenProps> = ({ children }) => createElement('Filter', {}, children);
