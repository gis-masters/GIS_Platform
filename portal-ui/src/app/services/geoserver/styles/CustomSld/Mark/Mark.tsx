import { createElement, type FC } from 'react';

import { type ChildrenProps } from '../../../../models';

export const Mark: FC<ChildrenProps> = ({ children }) => createElement('Mark', {}, children);
