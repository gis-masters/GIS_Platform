import { createElement, type FC } from 'react';

import { type ChildrenProps } from '../../../../models';

export const Literal: FC<ChildrenProps> = ({ children }) => createElement('Literal', {}, children);
