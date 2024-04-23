import { createElement, FC } from 'react';

import { ChildrenProps } from '../../../../models';

export const WellKnownName: FC<ChildrenProps> = ({ children }) => createElement('WellKnownName', {}, children);
