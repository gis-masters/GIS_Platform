import { createElement, type FC } from 'react';

import { type ChildrenProps } from '../../../../models';

export const PropertyIsEqualTo: FC<ChildrenProps> = ({ children }) => createElement('PropertyIsEqualTo', {}, children);
