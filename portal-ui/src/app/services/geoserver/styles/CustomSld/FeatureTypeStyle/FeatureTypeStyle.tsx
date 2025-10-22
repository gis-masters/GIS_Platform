import { createElement, type FC } from 'react';

import { type ChildrenProps } from '../../../../models';

export const FeatureTypeStyle: FC<ChildrenProps> = ({ children }) => createElement('FeatureTypeStyle', {}, children);
