import { createElement, FC } from 'react';

import { ChildrenProps } from '../../../../models';

export const LabelPlacement: FC<ChildrenProps> = ({ children }) => createElement('LabelPlacement', {}, children);
