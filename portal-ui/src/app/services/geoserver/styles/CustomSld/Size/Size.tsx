import { createElement, FC } from 'react';

import { ChildrenProps } from '../../../../models';

export const Size: FC<ChildrenProps> = ({ children }) => createElement('Size', {}, children);
