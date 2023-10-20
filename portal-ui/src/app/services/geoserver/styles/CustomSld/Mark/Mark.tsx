import { FC, createElement } from 'react';

import { ChildrenProps } from '../../../../models';

export const Mark: FC<ChildrenProps> = ({ children }) => createElement('Mark', {}, children);
