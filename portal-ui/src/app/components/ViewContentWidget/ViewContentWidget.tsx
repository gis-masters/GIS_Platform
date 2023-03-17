import React, { FC } from 'react';
import { Paper } from '@mui/material';
import { RegistryConsumer } from '@bem-react/di';
import { cn } from '@bem-react/classname';

import { Schema } from '../../services/data/schema/schema.models';
import { CommonDiRegistry } from '../../services/di-registry';

import '!style-loader!css-loader!sass-loader!./ViewContentWidget.scss';

const cnViewContentWidget = cn('ViewContentWidget');

interface ViewContentWidgetProps {
  schema: Schema;
  data: unknown;
  title: string;
}

export const ViewContentWidget: FC<ViewContentWidgetProps> = ({ data, schema, title }) => (
  <>
    <span className={cnViewContentWidget('Title')}>{title}:</span>
    <Paper className={cnViewContentWidget(null, ['scroll'])} variant='outlined' square>
      <RegistryConsumer id='common'>
        {({ Form }: CommonDiRegistry) => <Form schema={schema} value={data} readonly />}
      </RegistryConsumer>
    </Paper>
  </>
);
