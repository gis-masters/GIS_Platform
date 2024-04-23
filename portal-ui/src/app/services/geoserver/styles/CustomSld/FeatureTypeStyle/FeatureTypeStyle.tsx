import { createElement, FC } from 'react';

import { ChildrenProps } from '../../../../models';

export const FeatureTypeStyle: FC<ChildrenProps> = ({ children }) => createElement('FeatureTypeStyle', {}, children);
