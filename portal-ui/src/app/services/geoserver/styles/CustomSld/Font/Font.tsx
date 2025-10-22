import { createElement, type FC } from 'react';

import { type ChildrenProps } from '../../../../models';

export const Font: FC<ChildrenProps> = ({ children }) => createElement('Font', {}, children);
