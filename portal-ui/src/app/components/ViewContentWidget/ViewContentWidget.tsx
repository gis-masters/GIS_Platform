import React, { type FC } from 'react';
import { Paper } from '@mui/material';
import { cn } from '@bem-react/classname';
import { RegistryConsumer } from '@bem-react/di';

import { type Schema, type SimpleSchema } from '../../services/data/schema/schema.models';
import { type CommonDiRegistry } from '../../services/di-registry';
import { type FormRole } from '../Form/Form.models';

import './ViewContentWidget.scss';

const cnViewContentWidget = cn('ViewContentWidget');

interface ViewContentWidgetProps {
  schema: Schema | SimpleSchema;
  data: unknown;
  title: string;
  formRole?: FormRole;
}

export const ViewContentWidget: FC<ViewContentWidgetProps> = ({ data, schema, title, formRole }) => (
  <>
    <span className={cnViewContentWidget('Title')}>{title}:</span>
    <Paper className={cnViewContentWidget(null, ['scroll'])} variant='outlined' square>
      <RegistryConsumer id='common'>
        {({ Form }: CommonDiRegistry) => <Form formRole={formRole} schema={schema} value={data || {}} readonly />}
      </RegistryConsumer>
    </Paper>
  </>
);
