import { createElement, FC } from 'react';

import { ChildrenProps } from '../../../../models';

export const Rule: FC<ChildrenProps> = ({ children }) => createElement('Rule', {}, children);
