import React, { FC } from 'react';
import { withBemMod } from '@bem-react/core';

import {
  cnEditFeatureGeometryGroup,
  ContainerProps,
  EditFeatureGeometryGroupProps
} from '../EditFeatureGeometry-Group.base';

const Container: FC = (props: ContainerProps) => <div {...props} />;

export const withMultiple = withBemMod<EditFeatureGeometryGroupProps, EditFeatureGeometryGroupProps>(
  cnEditFeatureGeometryGroup(),
  { multiple: true },
  EditFeatureGeometryGroup => props => <EditFeatureGeometryGroup {...props} Container={Container} />
);
