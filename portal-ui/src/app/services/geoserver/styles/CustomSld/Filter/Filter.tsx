import { FC, createElement } from 'react';

import { ChildrenProps } from '../../../../models';

export const Filter: FC<ChildrenProps> = ({ children }) => createElement('Filter', {}, children);
