import { createElement, type FC } from 'react';

import { type ChildrenProps } from '../../../../models';

export const Name: FC<ChildrenProps> = ({ children }) => createElement('Name', {}, children);
