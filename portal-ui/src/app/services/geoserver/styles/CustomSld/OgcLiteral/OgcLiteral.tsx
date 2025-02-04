import { createElement, FC } from 'react';

import { ChildrenProps } from '../../../../models';

export const OgcLiteral: FC<ChildrenProps> = ({ children }) => createElement('ogc:Literal', {}, children);
