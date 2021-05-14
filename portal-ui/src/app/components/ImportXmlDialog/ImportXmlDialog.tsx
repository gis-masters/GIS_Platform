import React, { Component } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { boundMethod } from 'autobind-decorator';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';

import { importXml } from '../../services/import-xml.service';
import { services } from '../../services/services';
import { Button } from '../Button/Button';
import { FileInput } from '../FileInput/FileInput';
import { Form, FormControl, FormField, FormLabel } from '../Form/Form';
import { Toast } from '../Toast/Toast';

interface ImportXmlDialogProps {
  open: boolean;
  onClose: () => void;
  datasetId: string;
  tableId: string;
}

@observer
export class ImportXmlDialog extends Component<ImportXmlDialogProps> {
  @observable file?: File;

  render() {
    const { open, onClose } = this.props;

    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Импорт объектов из XML файла</DialogTitle>
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
          <Button form='importXmlFileForm' type='submit' color='primary' disabled={!this.file}>
            Импортировать
          </Button>
          <Button onClick={onClose}>Отмена</Button>
        </DialogActions>
      </Dialog>
    );
  }

  @boundMethod
  private async submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const { datasetId, tableId, onClose } = this.props;

    try {
      await importXml(this.file, datasetId, tableId);
      Toast.success('Объекты из файла импортированы успешно');
    } catch (ex) {
      Toast.error('Возникла ошибка при загрузке файла. ' + ex.message);
      services.logger.error('Возникла ошибка при загрузке файла: ', ex.message);
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
  }
}
