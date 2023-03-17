import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { action, observable, makeObservable } from 'mobx';
import { cn } from '@bem-react/classname';
import { TextField, Dialog, DialogTitle, DialogActions, DialogContent } from '@mui/material';
import { boundMethod } from 'autobind-decorator';

import { Toast } from '../Toast/Toast';
import { Button } from '../Button/Button';
import { Loading } from '../Loading/Loading';
import { Form, FormControl, FormField, FormLabel } from '../Form/Form';
import { createDataset } from '../../services/data/vectorData/vectorData.service';

import '!style-loader!css-loader!sass-loader!./CreateDatasetDialog.scss';

const cnCreateDatasetDialog = cn('CreateDatasetDialog');

interface CreateDatasetDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

/**
 * @deprecated
 */
@observer
export class CreateDatasetDialog extends Component<CreateDatasetDialogProps> {
  @observable private busy = false;
  @observable private newDatasetTitle = '';
  @observable private newDatasetDesc = '';

  private maxNameLength = 250;
  private maxDescLength = 1000;

  constructor(props: CreateDatasetDialogProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { open } = this.props;

    return (
      <Dialog className={cnCreateDatasetDialog()} maxWidth={'md'} open={open} onClose={this.closeDialog}>
        <DialogTitle>Создание нового набора данных</DialogTitle>

        <DialogContent className={cnCreateDatasetDialog('Content')}>
          <Form id='createDatasetForm' onSubmit={this.create}>
            <FormField>
              <FormLabel htmlFor='datasetTitle'>Название</FormLabel>
              <FormControl>
                <TextField
                  id='datasetTitle'
                  helperText={`${this.newDatasetTitle.length}/${this.maxNameLength}`}
                  autoFocus
                  inputProps={{ maxLength: this.maxNameLength }}
                  onChange={this.handleNameChange}
                  variant='standard'
                />
              </FormControl>
            </FormField>
            <FormField>
              <FormLabel htmlFor='datasetDesc'>Описание</FormLabel>
              <FormControl>
                <TextField
                  id='datasetDesc'
                  multiline
                  rows={5}
                  helperText={`${this.newDatasetDesc.length}/${this.maxDescLength}`}
                  inputProps={{ maxLength: this.maxDescLength }}
                  onChange={this.handleDescChange}
                  variant='standard'
                />
              </FormControl>
            </FormField>
          </Form>
          <Loading visible={this.busy} />
        </DialogContent>

        <DialogActions>
          <Button form='createDatasetForm' type='submit' color='primary' disabled={!this.newDatasetTitle}>
            Создать
          </Button>
          <Button onClick={this.closeDialog}>Отмена</Button>
        </DialogActions>
      </Dialog>
    );
  }

  @boundMethod
  private async create(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    this.setBusy(true);
    try {
      await createDataset({ title: this.newDatasetTitle, details: this.newDatasetDesc });

      Toast.info(`Успешно создан набор данных: \n"${this.newDatasetTitle}"`);
      this.props.onCreated();
    } catch {
      Toast.error('Произошла ошибка при создании набора данных');
    } finally {
      this.clearState();
    }
  }

  @action.bound
  private handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.newDatasetTitle = e.target.value;
  }

  @action.bound
  private handleDescChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.newDatasetDesc = e.target.value;
  }

  @action.bound
  private closeDialog() {
    this.clearState();
    this.props.onClose();
  }

  @action
  private setBusy(isBusy: boolean) {
    this.busy = isBusy;
  }

  @action
  private clearState() {
    this.newDatasetTitle = '';
    this.newDatasetDesc = '';
    this.setBusy(false);
  }
}
