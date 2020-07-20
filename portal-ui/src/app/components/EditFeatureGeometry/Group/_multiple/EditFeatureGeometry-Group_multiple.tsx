import React, { FC } from 'react';
import { withBemMod } from '@bem-react/core';
import Paper from '@material-ui/core/Paper';

import {
  EditFeatureGeometryGroupProps,
  ContainerProps,
  cnEditFeatureGeometryGroup
} from '../EditFeatureGeometry-Group';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-Group_multiple.scss';

const Container: FC = (props: ContainerProps) => <Paper {...props} square={true} elevation={2} />;

export const withMultiple = withBemMod<EditFeatureGeometryGroupProps>(
  cnEditFeatureGeometryGroup(),
  { multiple: true },
  EditFeatureGeometryGroup => props => <EditFeatureGeometryGroup {...props} Container={Container} />
);
