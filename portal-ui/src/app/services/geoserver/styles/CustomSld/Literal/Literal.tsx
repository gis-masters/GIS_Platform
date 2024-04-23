import { createElement, FC } from 'react';

import { ChildrenProps } from '../../../../models';

export const Literal: FC<ChildrenProps> = ({ children }) => createElement('Literal', {}, children);
