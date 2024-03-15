import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { IClassNameProps } from '@bem-react/core';
import { cn } from '@bem-react/classname';

import { currentUser } from '../../stores/CurrentUser.store';
import { Schema } from '../../services/data/schema/schema.models';
import { ActionsItemVariant } from '../Actions/Item/Actions-Item.base';
import { Actions } from '../Actions/Actions.composed';

import { SchemaActionsEdit } from './Edit/SchemaActions-Edit';
import { SchemaActionsPreview } from './Preview/SchemaActions-Preview';
import { SchemaActionsClose } from './Close/SchemaActions-Close';

export const cnSchemaActions = cn('SchemaActions');

export interface SchemaActionsProps extends IClassNameProps {
  schema: Schema;
  as: ActionsItemVariant;
  readonly?: boolean;
  forDialog?: boolean;
  onClose?(): void;
}

@observer
export default class SchemaActions extends Component<SchemaActionsProps> {
  render() {
    const { as, schema, className, forDialog, readonly, onClose } = this.props;

    return (
      <Actions className={cnSchemaActions({ forDialog }, [className])} as={as}>
        {currentUser.isAdmin && !readonly && <SchemaActionsEdit schema={schema} as={as} />}
        <SchemaActionsPreview schema={schema} as={as} />
        {forDialog && <SchemaActionsClose as={as} onClick={onClose} />}
      </Actions>
    );
  }
}
