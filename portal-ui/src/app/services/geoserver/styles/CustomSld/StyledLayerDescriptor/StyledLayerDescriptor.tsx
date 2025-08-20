import { createElement, FC } from 'react';

import { ChildrenProps } from '../../../../models';

export const StyledLayerDescriptor: FC<ChildrenProps> = ({ children }) =>
  createElement(
    'StyledLayerDescriptor',
    {
      'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      'xmlns:ogc': 'http://www.opengis.net/ogc',
      version: '1.1.0'
    },
    children
  );
