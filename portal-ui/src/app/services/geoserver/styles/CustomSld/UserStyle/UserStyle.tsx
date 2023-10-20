import { FC, createElement } from 'react';

import { ChildrenProps } from '../../../../models';

export const UserStyle: FC<ChildrenProps> = ({ children }) => createElement('UserStyle', {}, children);
