import { createElement, type FC } from 'react';

import { type ChildrenProps } from '../../../../models';

export const Fill: FC<ChildrenProps> = ({ children }) => createElement('Fill', {}, children);
