import React, { Component } from 'react';
import { action, observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { boundMethod } from 'autobind-decorator';

import { communicationService } from '../../services/communication.service';
import { importFeaturesFromShapeFile } from '../../services/data/file-placement/file-placement.service';
import { ImportShapeProcess } from '../../services/data/processes/processes.models';
import { awaitProcess } from '../../services/data/processes/processes.service';
import { isZipFile } from '../../services/data/files/files.util';
import { services } from '../../services/services';
import { Mime } from '../../services/util/Mime';
import { Form, FormControl, FormField, FormLabel } from '../Form/Form';
import { FileInput } from '../FileInput/FileInput';
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
    errorMessage?: string;
    warningMessage?: string;
    error?: string;
    quantityOfImportedRecords?: number;
  };
}

@observer
export class ImportShapeDialog extends Component<ImportShapeDialogProps> {
  @observable private file?: File;
  @observable private importDetails?: ImportShapeProcess;
  @observable private importDetailsDialogOpen = false;
  @observable private importWarningDialogOpen = false;
  @observable private importWarningMessage: string;
  @observable private loading = false;

  constructor(props: ImportShapeDialogProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { open, onClose } = this.props;

    return (
      <>
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

        <Dialog open={this.importDetailsDialogOpen} onClose={this.closeAll} fullWidth maxWidth='sm'>
          <DialogTitle>Геометрия из Shape-файла импортирована успешно</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Количество успешных записей: {this.importDetails?.quantityOfImportedRecords}
            </DialogContentText>
            <DialogContentText>
              Количество неудавшихся записей: {this.importDetails?.quantityOfFailedRecords}
            </DialogContentText>
            {!this.importDetails?.shapeFileHasProjection && (
              <DialogContentText>
                Исходный файл не имеет проекции, геометрия внесена в систему в {this.importDetails?.targetCrs}
              </DialogContentText>
            )}
            {this.importDetails?.shapeFileHasProjection && (
              <DialogContentText>Геометрия трансформирована в {this.importDetails?.targetCrs}</DialogContentText>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeAll}>Закрыть</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={this.importWarningDialogOpen} onClose={this.closeAll} fullWidth maxWidth='sm'>
          <DialogTitle>Возникла ошибка при импорте геометрии из Shape-файла</DialogTitle>
          <DialogContent>
            <DialogContentText>{this.importWarningMessage}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeAll}>Закрыть</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  @action
  private setLoading(loading: boolean) {
    this.loading = loading;
  }

  @boundMethod
  private async submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const { datasetId, tableId } = this.props;

    try {
      this.setLoading(true);
      const response = await importFeaturesFromShapeFile(this.file, datasetId, tableId);
      const importInfo = await awaitProcess(Number(response._links.process.href.split('/').at(-1)));

      if (importInfo) {
        this.setImportDetails(importInfo.details as ImportShapeProcess);
        this.openImportDetailDialog();
      }

      communicationService.featuresUpdated.emit({ type: 'create', data: null });
    } catch (error) {
      const err = error as ImportShapeDetails;

      if (err.details.warningMessage) {
        this.setImportWarning(err.details.warningMessage);
        this.openImportWarningDialog();
      } else {
        const errorDetails = err.details?.errorMessage || err.details?.error;

        Toast.warn({
          message: 'Возникла ошибка при импорте геометрии из Shape-файла',
          details: errorDetails
        });
        services.logger.warn('Возникла ошибка при импорте геометрии из Shape-файла: ', errorDetails);
      }
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
  private setImportDetails(importDetails: ImportShapeProcess) {
    this.importDetails = importDetails;
  }

  @action
  private reset() {
    this.file = null;
    this.loading = false;
  }

  @action.bound
  private openImportDetailDialog() {
    this.importDetailsDialogOpen = true;
  }

  @action.bound
  private openImportWarningDialog() {
    this.importWarningDialogOpen = true;
  }

  @action.bound
  private setImportWarning(importWarning: string) {
    this.importWarningMessage = importWarning;
  }

  @action.bound
  private closeAll() {
    this.reset();
    this.props.onClose();
    this.importDetailsDialogOpen = false;
    this.importWarningDialogOpen = false;
  }
}
