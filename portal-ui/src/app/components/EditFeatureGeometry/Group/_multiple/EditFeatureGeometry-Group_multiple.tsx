import * as React from 'react';
import { withBemMod } from '@bem-react/core'
import { cn } from '@bem-react/classname';
import Paper from '@material-ui/core/Paper';

import { EditFeatureGeometryGroupProps, ContainerProps } from '../EditFeatureGeometry-Group';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-Group_multiple.scss';

const cnEditFeatureGeometry = cn('EditFeatureGeometry');

const Container: React.FC = (props: ContainerProps) => (
  <Paper {...props} square={true} elevation={2} />
);

export const withMultiple = withBemMod<EditFeatureGeometryGroupProps>(
  cnEditFeatureGeometry('Group'),
  { multiple: true },
  (EditFeatureGeometryGroup) => (props) => <EditFeatureGeometryGroup {...props} Container={Container} />,
);
