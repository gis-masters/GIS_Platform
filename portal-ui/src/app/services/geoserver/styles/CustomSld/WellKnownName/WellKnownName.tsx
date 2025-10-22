import { createElement, type FC } from 'react';

import { type ChildrenProps } from '../../../../models';

export const WellKnownName: FC<ChildrenProps> = ({ children }) => createElement('WellKnownName', {}, children);
