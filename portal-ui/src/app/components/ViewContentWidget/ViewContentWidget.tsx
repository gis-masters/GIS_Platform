import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { Paper } from '@mui/material';

import { PropertySchema } from '../../services/crg/schema.models';
import { Form } from '../Form/Form';

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
      <Form fields={fields} value={data} readonly />
    </Paper>
  </>
);
