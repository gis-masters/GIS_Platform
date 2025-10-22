import { createElement, type FC } from 'react';

import { type ChildrenProps } from '../../../../models';

export const UserStyle: FC<ChildrenProps> = ({ children }) => createElement('UserStyle', {}, children);
