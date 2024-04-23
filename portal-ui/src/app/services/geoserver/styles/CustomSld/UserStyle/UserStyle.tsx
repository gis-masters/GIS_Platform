import { createElement, FC } from 'react';

import { ChildrenProps } from '../../../../models';

export const UserStyle: FC<ChildrenProps> = ({ children }) => createElement('UserStyle', {}, children);
