import React, { Component } from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@material-ui/core';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { Form, FormControl, FormField, FormLabel } from '../Form/Form';
import { Button } from '../Button/Button';

const cnLayersGroupEditDialog = cn('LayersGroupEditDialog');

interface LayersGroupEditDialogProps {
  open: boolean;
  onClose: () => void;
  onEdit: (title: string) => void;
  title?: string;
  create?: boolean;
}

const LAYERS_GROUP_TITLE_MAX_LENGTH = 255;

@observer
export class LayersGroupEditDialog extends Component<LayersGroupEditDialogProps> {
  @observable private title = '';

  render() {
    const { open, create, title } = this.props;

    return (
      <Dialog className={cnLayersGroupEditDialog()} open={open} onClose={this.close}>
        <DialogTitle>{create ? 'Создание' : 'Редактирование'} группы</DialogTitle>
        <DialogContent>
          <Form id='editLayersGroupForm' onSubmit={this.edit}>
            <FormField>
              <FormLabel htmlFor='groupTitle'>Название</FormLabel>
              <FormControl>
                <TextField
                  id='groupTitle'
                  value={this.title || title || ''}
                  onChange={this.handleGroupNameChange}
                  inputProps={{ maxLength: LAYERS_GROUP_TITLE_MAX_LENGTH }}
                  autoFocus
                />
              </FormControl>
            </FormField>
          </Form>
        </DialogContent>
        <DialogActions>
          <Button
            form='editLayersGroupForm'
            type='submit'
            color='primary'
            disabled={!this.title || this.title === title}
          >
            {create ? 'Создать' : 'Изменить'}
          </Button>
          <Button onClick={this.close} variant='outlined'>
            Отмена
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  @action.bound
  private handleGroupNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.title = e.target.value;
  }

  @action.bound
  private close() {
    this.title = '';
    this.props.onClose();
  }

  @boundMethod
  private edit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    this.props.onEdit(this.title);
    this.close();
  }
}
