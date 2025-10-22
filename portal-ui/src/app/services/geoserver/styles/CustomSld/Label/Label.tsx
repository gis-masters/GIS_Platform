import { createElement, type FC } from 'react';

import { type ChildrenProps } from '../../../../models';

export const Label: FC<ChildrenProps> = ({ children }) => createElement('Label', {}, children);
