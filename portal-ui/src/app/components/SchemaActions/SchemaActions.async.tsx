import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { IClassNameProps } from '@bem-react/core';
import { cn } from '@bem-react/classname';

import { ActionsItemVariant } from '../Actions/Item/Actions-Item.base';
import { OldSchema } from '../../services/data/schemaOld.models';
import { SchemaActionsEdit } from './Edit/SchemaActions-Edit';
import { Actions } from '../Actions/Actions.composed';

export const cnSchemaActions = cn('SchemaActions');

export interface SchemaActionsProps extends IClassNameProps {
  schema: OldSchema;
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
      </Actions>
    );
  }
}
