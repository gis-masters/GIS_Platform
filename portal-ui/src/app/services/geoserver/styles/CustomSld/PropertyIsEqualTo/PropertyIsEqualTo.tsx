import { FC, createElement } from 'react';

import { ChildrenProps } from '../../../../models';

export const PropertyIsEqualTo: FC<ChildrenProps> = ({ children }) => createElement('PropertyIsEqualTo', {}, children);
