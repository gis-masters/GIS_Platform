import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { IClassNameProps } from '@bem-react/core';
import { cn } from '@bem-react/classname';

import { Schema } from '../../services/data/schema/schema.models';
import { ActionsItemVariant } from '../Actions/Item/Actions-Item.base';
import { Actions } from '../Actions/Actions.composed';

import { SchemaActionsEdit } from './Edit/SchemaActions-Edit';
import { SchemaActionsPreview } from './Preview/SchemaActions-Preview';

export const cnSchemaActions = cn('SchemaActions');

export interface SchemaActionsProps extends IClassNameProps {
  schema: Schema;
  as: ActionsItemVariant;
  forDialog?: boolean;
}

@observer
export default class SchemaActions extends Component<SchemaActionsProps> {
  render() {
    const { as, schema, className, forDialog } = this.props;

    return (
      <Actions className={cnSchemaActions({ forDialog }, [className])} as={as}>
        <SchemaActionsEdit schema={schema} as={as} />
        <SchemaActionsPreview schema={schema} as={as} />
      </Actions>
    );
  }
}
