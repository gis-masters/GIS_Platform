import { createElement, FC } from 'react';

import { ChildrenProps } from '../../../../models';

export const Label: FC<ChildrenProps> = ({ children }) => createElement('Label', {}, children);
