import { FC, createElement } from 'react';

import { ChildrenProps } from '../../../../models';

export const NamedLayer: FC<ChildrenProps> = ({ children }) => createElement('NamedLayer', {}, children);
