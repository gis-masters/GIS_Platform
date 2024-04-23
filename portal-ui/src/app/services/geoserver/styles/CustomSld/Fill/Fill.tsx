import { createElement, FC } from 'react';

import { ChildrenProps } from '../../../../models';

export const Fill: FC<ChildrenProps> = ({ children }) => createElement('Fill', {}, children);
