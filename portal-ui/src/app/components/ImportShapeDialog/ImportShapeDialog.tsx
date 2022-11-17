import React, { Component } from 'react';
import { action, observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { boundMethod } from 'autobind-decorator';

import { communicationService } from '../../services/communication.service';
import { importFeaturesFromShapeFile } from '../../services/data/file-placement.service';
import { Form, FormControl, FormField, FormLabel } from '../Form/Form';
import { awaitProcess } from '../../services/data/processes.service';
import { getProcessUrl } from '../../services/server-urls.service';
import { isZipFile } from '../../services/data/files.util';
import { services } from '../../services/services';
import { FileInput } from '../FileInput/FileInput';
import { Mime } from '../../services/util/Mime';
import { Button } from '../Button/Button';
import { Toast } from '../Toast/Toast';

interface ImportShapeDialogProps {
  open: boolean;
  onClose: () => void;
  datasetId: string;
  tableId: string;
}

interface ImportShapeDetails {
  details: {
    message?: string;
    error?: string;
    quantityOfImportedRecords?: number;
  };
}

@observer
export class ImportShapeDialog extends Component<ImportShapeDialogProps> {
  @observable private file?: File;
  @observable private loading = false;

  constructor(props: ImportShapeDialogProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { open, onClose } = this.props;

    return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
        <DialogTitle>Импорт геометрии из Shape-файла</DialogTitle>
        <DialogContent>
          <DialogContentText>Выберите zip архив, в котором содержится Shape-файл</DialogContentText>
          <Form id='importShapeFileForm' onSubmit={this.submitHandler}>
            <FormField>
              <FormLabel htmlFor='importShapeFileField'>Файл</FormLabel>
              <FormControl>
                <FileInput accept={Mime.ZIP} fullWidth onChange={this.changeHandler} id='importShapeFileField' />
              </FormControl>
            </FormField>
          </Form>
        </DialogContent>
        <DialogActions>
          <Button
            loading={this.loading}
            form='importShapeFileForm'
            type='submit'
            color='primary'
            disabled={!this.file || this.loading}
          >
            Импортировать
          </Button>
          <Button onClick={onClose}>Отмена</Button>
        </DialogActions>
      </Dialog>
    );
  }

  @action
  private setLoading(loading: boolean) {
    this.loading = loading;
  }

  @boundMethod
  private async submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const { datasetId, tableId, onClose } = this.props;

    try {
      this.setLoading(true);
      const response = await importFeaturesFromShapeFile(this.file, datasetId, tableId);
      await awaitProcess(await getProcessUrl(Number(response._links.process.href.split('/').at(-1))));
      Toast.success('Геометрия из Shape-файла импортирована успешно');

      onClose();
      communicationService.featuresUpdated.emit();
    } catch (error) {
      const err = error as ImportShapeDetails;
      const errorDetails = err.details?.message || err.details?.error;

      Toast.warn({
        message: 'Возникла ошибка при импорте геометрии из Shape-файла',
        details: errorDetails
      });
      services.logger.warn('Возникла ошибка при импорте геометрии из Shape-файла: ', errorDetails);
    }

    this.reset();
  }

  @action.bound
  private changeHandler(fileList: FileList) {
    this.reset();
    if (fileList[0] && isZipFile(fileList[0])) {
      this.file = fileList[0];
    }
  }

  @action
  private reset() {
    this.file = null;
    this.loading = false;
  }
}
