import { createElement, type FC } from 'react';

import { type ChildrenProps } from '../../../../models';

export const LabelPlacement: FC<ChildrenProps> = ({ children }) => createElement('LabelPlacement', {}, children);
