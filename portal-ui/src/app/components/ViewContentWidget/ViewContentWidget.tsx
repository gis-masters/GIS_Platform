import React, { FC } from 'react';
import { Paper } from '@mui/material';
import { RegistryConsumer } from '@bem-react/di';
import { cn } from '@bem-react/classname';

import { PropertySchema } from '../../services/crg/schema.models';

import '!style-loader!css-loader!sass-loader!./ViewContentWidget.scss';

const cnViewContentWidget = cn('ViewContentWidget');

interface ViewContentWidgetProps {
  fields: PropertySchema[];
  data: Record<string, unknown>;
}

export const ViewContentWidget: FC<ViewContentWidgetProps> = ({ data, fields }) => (
  <>
    <span className={cnViewContentWidget('Title')}>Карточка документа:</span>
    <Paper className={cnViewContentWidget(null, ['scroll'])} variant='outlined' square>
      <RegistryConsumer id='common'>{({ Form }) => <Form fields={fields} value={data} readonly />}</RegistryConsumer>
    </Paper>
  </>
);
