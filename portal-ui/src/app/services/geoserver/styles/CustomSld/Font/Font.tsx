import { createElement, FC } from 'react';

import { ChildrenProps } from '../../../../models';

export const Font: FC<ChildrenProps> = ({ children }) => createElement('Font', {}, children);
