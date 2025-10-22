import { createElement, type FC } from 'react';

import { type ChildrenProps } from '../../../../models';

export const OgcLiteral: FC<ChildrenProps> = ({ children }) => createElement('ogc:Literal', {}, children);
