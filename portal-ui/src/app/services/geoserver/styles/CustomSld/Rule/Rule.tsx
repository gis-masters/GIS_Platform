import { createElement, type FC } from 'react';

import { type ChildrenProps } from '../../../../models';

export const Rule: FC<ChildrenProps> = ({ children }) => createElement('Rule', {}, children);
