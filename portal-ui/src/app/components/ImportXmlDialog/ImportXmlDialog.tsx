import React, { Component } from 'react';
import { action, observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { AxiosError } from 'axios';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { boundMethod } from 'autobind-decorator';

import { mapSelectionService } from '../../services/map/map-selection.service';
import { getFeaturesById } from '../../services/geoserver/wfs/wfs.service';
import { importXml } from '../../services/data/import-xml/import-xml.service';
import { mapService } from '../../services/map/map.service';
import { services } from '../../services/services';
import { Mime } from '../../services/util/Mime';
import { cnFormControl } from '../Form/Control/Form-Control';
import { Form, FormField, FormLabel } from '../Form/Form';
import { FileInput } from '../FileInput/FileInput';
import { Button } from '../Button/Button';
import { Toast } from '../Toast/Toast';

interface ImportXmlDialogProps {
  open: boolean;
  onClose: () => void;
  datasetId: string;
  tableId: string;
  complexName?: string;
}

@observer
export class ImportXmlDialog extends Component<ImportXmlDialogProps> {
  @observable private file?: File;
  @observable private loading = false;

  constructor(props: ImportXmlDialogProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { open, onClose } = this.props;

    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Импорт межевого плана из XML</DialogTitle>
        <DialogContent>
          <DialogContentText>Выберите межевой план в формате XML</DialogContentText>
          <Form id='importXmlFileForm' onSubmit={this.submitHandler}>
            <FormField>
              <FormLabel htmlFor='importXmlFileField'>Файл</FormLabel>
              <div className={cnFormControl()}>
                <FileInput accept={Mime.XML} fullWidth onChange={this.changeHandler} id='importXmlFileField' />
              </div>
            </FormField>
          </Form>
        </DialogContent>
        <DialogActions>
          <Button form='importXmlFileForm' type='submit' color='primary' disabled={!this.file || this.loading}>
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

    const { datasetId, tableId, onClose, complexName } = this.props;

    try {
      this.setLoading(true);

      if (!complexName) {
        throw new Error('Некорректный слой');
      }

      if (!this.file) {
        throw new Error('Не указан файл');
      }

      const objectId = await importXml(this.file, datasetId, tableId);
      const wfsFeatures = await getFeaturesById([objectId.toString()], complexName);
      if (wfsFeatures.length > 0) {
        mapSelectionService.selectFeatures(wfsFeatures);
        mapService.positionToFeatures(wfsFeatures);
      }
      Toast.success('Объекты из файла импортированы успешно');
    } catch (error) {
      Toast.warn('Возникла ошибка при загрузке файла. ' + (error as AxiosError).message);
      services.logger.warn('Возникла ошибка при загрузке файла: ', (error as AxiosError).message);
    }
    this.reset();

    onClose();
  }

  @action.bound
  private changeHandler(fileList: FileList | null) {
    if (fileList?.[0]) {
      this.file = fileList[0];
    }
  }

  @action
  private reset() {
    this.file = undefined;
    this.loading = false;
  }
}
