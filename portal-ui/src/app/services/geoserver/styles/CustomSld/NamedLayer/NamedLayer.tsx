import { createElement, type FC } from 'react';

import { type ChildrenProps } from '../../../../models';

export const NamedLayer: FC<ChildrenProps> = ({ children }) => createElement('NamedLayer', {}, children);
