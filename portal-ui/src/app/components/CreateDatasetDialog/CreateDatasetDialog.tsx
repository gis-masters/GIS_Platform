import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { action, observable } from 'mobx';
import { cn } from '@bem-react/classname';
import { TextField, Dialog, DialogTitle, DialogActions, DialogContent } from '@material-ui/core';
import { boundMethod } from 'autobind-decorator';
import { Loading } from '../Loading/Loading';

import { Toast } from '../Toast/Toast';
import { Button } from '../Button/Button';
import { projectsService } from '../../services/crg/projects.service';
import { Form, FormControl, FormField, FormLabel } from '../Form/Form';

import '!style-loader!css-loader!sass-loader!./CreateDatasetDialog.scss';

const cnCreateDatasetDialog = cn('CreateDatasetDialog');

interface CreateDatasetDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

@observer
export class CreateDatasetDialog extends Component<CreateDatasetDialogProps> {
  @observable private busy = false;
  @observable private newDatasetName = '';
  @observable private newDatasetDesc = '';

  private maxNameLength = 250;
  private maxDescLength = 1000;

  render() {
    const { open } = this.props;

    return (
      <Dialog className={cnCreateDatasetDialog()} maxWidth={'md'} open={open} onClose={this.props.onClose}>
        <DialogTitle>Создание нового набора данных</DialogTitle>

        <DialogContent className={cnCreateDatasetDialog('Content')}>
          <Form id='createDatasetForm' onSubmit={this.create}>
            <FormField>
              <FormLabel htmlFor='datasetTitle'>Название</FormLabel>
              <FormControl>
                <TextField
                  id='datasetTitle'
                  helperText={`${this.newDatasetName.length}/${this.maxNameLength}`}
                  autoFocus
                  inputProps={{ maxLength: this.maxNameLength }}
                  onChange={this.handleNameChange}
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
                  rowsMax={10}
                  helperText={`${this.newDatasetDesc.length}/${this.maxDescLength}`}
                  inputProps={{ maxLength: this.maxDescLength }}
                  onChange={this.handleDescChange}
                />
              </FormControl>
            </FormField>
          </Form>
          <Loading visible={this.busy} />
        </DialogContent>

        <DialogActions>
          <Button form='createDatasetForm' type='submit' color='primary' disabled={!this.newDatasetName}>
            Создать
          </Button>
          <Button onClick={this.props.onClose}>Отмена</Button>
        </DialogActions>
      </Dialog>
    );
  }

  @boundMethod
  private async create(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    this.setBusy(true);
    try {
      await projectsService.createDataset(this.newDatasetName, this.newDatasetDesc);

      Toast.info(`Успешно создан набор данных: \n"${this.newDatasetName}"`);
      this.props.onCreated();
    } catch (err) {
      Toast.error(`Произошла ошибка при создании набора данных`);
    } finally {
      this.setBusy(false);
    }
  }

  @action.bound
  private handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.newDatasetName = e.target.value;
  }

  @action.bound
  private handleDescChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.newDatasetDesc = e.target.value;
  }

  @action
  private setBusy(isBusy: boolean) {
    this.busy = isBusy;
  }
}
