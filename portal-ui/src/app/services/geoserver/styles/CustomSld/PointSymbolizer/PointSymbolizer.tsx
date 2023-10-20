import { FC, createElement } from 'react';

import { ChildrenProps } from '../../../../models';

export const PointSymbolizer: FC<ChildrenProps> = ({ children }) => createElement('PointSymbolizer', {}, children);
