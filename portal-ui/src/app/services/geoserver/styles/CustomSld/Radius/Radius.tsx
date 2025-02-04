import { createElement, FC } from 'react';

import { ChildrenProps } from '../../../../models';

export const Radius: FC<ChildrenProps> = ({ children }) => createElement('Radius', {}, children);
