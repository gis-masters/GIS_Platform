import { FC, createElement } from 'react';

import { ChildrenProps } from '../../../../models';

export const Name: FC<ChildrenProps> = ({ children }) => createElement('Name', {}, children);
