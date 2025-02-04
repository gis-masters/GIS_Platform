import { createElement, FC } from 'react';

import { ChildrenProps } from '../../../../models';

export const OgcPropertyName: FC<ChildrenProps> = ({ children }) => createElement('ogc:PropertyName', {}, children);
