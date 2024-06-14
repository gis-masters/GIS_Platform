import React, { FC } from 'react';
import Paper from '@mui/material/Paper';
import { withBemMod } from '@bem-react/core';

import {
  cnEditFeatureGeometryGroup,
  ContainerProps,
  EditFeatureGeometryGroupProps
} from '../EditFeatureGeometry-Group.base';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-Group_multiple.scss';

const Container: FC = (props: ContainerProps) => <Paper {...props} square elevation={2} />;

export const withMultiple = withBemMod<EditFeatureGeometryGroupProps, EditFeatureGeometryGroupProps>(
  cnEditFeatureGeometryGroup(),
  { multiple: true },
  EditFeatureGeometryGroup => props => <EditFeatureGeometryGroup {...props} Container={Container} />
);
