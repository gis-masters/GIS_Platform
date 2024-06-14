import React, { Component } from 'react';
import { action, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { PropertyType, SimpleSchema } from '../../services/data/schema/schema.models';
import { FormDialog } from '../FormDialog/FormDialog';

const cnLayersGroupEditDialog = cn('LayersGroupEditDialog');

interface LayersGroupEditDialogProps {
  open: boolean;
  title?: string;
  create?: boolean;
  onClose(): void;
  onEdit(title: string): void;
}

@observer
export class LayersGroupEditDialog extends Component<LayersGroupEditDialogProps> {
  private schema: SimpleSchema = {
    properties: [
      {
        name: 'title',
        title: 'Название',
        propertyType: PropertyType.STRING,
        maxLength: 255
      }
    ]
  };

  constructor(props: LayersGroupEditDialogProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { open, create, title = '' } = this.props;

    return (
      <FormDialog<{ title: string }>
        className={cnLayersGroupEditDialog()}
        value={create ? {} : { title }}
        open={open}
        title={`${create ? 'Создание' : 'Редактирование'} группы`}
        actionFunction={this.edit}
        onClose={this.close}
        schema={this.schema}
        actionButtonProps={{ children: create ? 'Создать' : 'Изменить' }}
      />
    );
  }

  @action.bound
  private close() {
    this.props.onClose();
  }

  @boundMethod
  private edit({ title }: { title: string }) {
    this.props.onEdit(title);
    this.close();
  }
}
