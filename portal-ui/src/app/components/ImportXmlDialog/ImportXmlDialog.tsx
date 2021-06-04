import React, { Component } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { boundMethod } from 'autobind-decorator';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';

import { services } from '../../services/services';
import { importXml } from '../../services/import-xml.service';
import { mapService } from '../../services/map/map.service';
import { getFeaturesById } from '../../services/geoserver/wfs.service';
import { Button } from '../Button/Button';
import { FileInput } from '../FileInput/FileInput';
import { Form, FormControl, FormField, FormLabel } from '../Form/Form';
import { Toast } from '../Toast/Toast';

interface ImportXmlDialogProps {
  open: boolean;
  onClose: () => void;
  datasetId: string;
  tableId: string;
  complexName: string;
}

@observer
export class ImportXmlDialog extends Component<ImportXmlDialogProps> {
  @observable private file?: File;
  @observable private loading = false;

  render() {
    const { open, onClose } = this.props;

    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Импорт межевого плана из XML</DialogTitle>
        <DialogContent>
          <DialogContentText>Выберете межевой план в формате XML</DialogContentText>
          <Form id='importXmlFileForm' onSubmit={this.submitHandler}>
            <FormField>
              <FormLabel htmlFor='importXmlFileField'>Файл</FormLabel>
              <FormControl>
                <FileInput fullWidth onChange={this.changeHandler} />
              </FormControl>
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
      let objectId = await importXml(this.file, datasetId, tableId);
      let wfsFeature = await getFeaturesById([objectId.toString()], complexName);
      if (wfsFeature.length > 0) {
        mapService.highlightFeatures(wfsFeature);
        mapService.positionToFeature(wfsFeature[0]);
      }
      Toast.success('Объекты из файла импортированы успешно');
    } catch (ex) {
      Toast.warn('Возникла ошибка при загрузке файла. ' + ex.message);
      services.logger.warn('Возникла ошибка при загрузке файла: ', ex.message);
    }
    this.reset();

    onClose();
  }

  @action.bound
  private changeHandler(fileList: FileList) {
    if (fileList[0]) {
      this.file = fileList[0];
    }
  }

  @action
  private reset() {
    this.file = null;
    this.loading = false;
  }
}
