import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { boundMethod } from 'autobind-decorator';
import { AxiosError } from 'axios';

import { importXml } from '../../services/data/import-xml/import-xml.service';
import { getFeaturesById } from '../../services/geoserver/wfs/wfs.service';
import { mapModeManager } from '../../services/map/a-map-mode/MapModeManager';
import { MapMode, MapSelectionTypes } from '../../services/map/map.models';
import { mapService } from '../../services/map/map.service';
import { services } from '../../services/services';
import { Mime } from '../../services/util/Mime';
import { Button } from '../Button/Button';
import { FileInput } from '../FileInput/FileInput';
import { cnFormControl } from '../Form/Control/Form-Control';
import { Form, FormField, FormLabel } from '../Form/Form';
import { Toast } from '../Toast/Toast';

interface ImportXmlDialogProps {
  open: boolean;
  datasetId: string;
  tableId: string;
  complexName?: string;
  onClose(): void;
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
          <Form id='importXmlFileForm' onSubmit={this.handleSubmit}>
            <FormField>
              <FormLabel htmlFor='importXmlFileField'>Файл</FormLabel>
              <div className={cnFormControl()}>
                <FileInput accept={Mime.XML} fullWidth onChange={this.handleChange} id='importXmlFileField' />
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
  private async handleSubmit(e: React.FormEvent<HTMLFormElement>) {
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
        await mapModeManager.changeMode(
          MapMode.SELECTED_FEATURES,
          {
            payload: {
              features: wfsFeatures,
              type: MapSelectionTypes.REPLACE
            }
          },
          'XMLimport handleSubmit'
        );

        await mapService.positionToFeatures(wfsFeatures);
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
  private handleChange(fileList: FileList | null) {
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
