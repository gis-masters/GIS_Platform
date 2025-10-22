import { createElement, type FC } from 'react';

import { type ChildrenProps } from '../../../../models';

export const OgcPropertyName: FC<ChildrenProps> = ({ children }) => createElement('ogc:PropertyName', {}, children);
