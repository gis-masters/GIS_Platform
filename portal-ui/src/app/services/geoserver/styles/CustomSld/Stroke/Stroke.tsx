import { FC, createElement } from 'react';

import { ChildrenProps } from '../../../../models';

export const Stroke: FC<ChildrenProps> = ({ children }) => createElement('Stroke', {}, children);
