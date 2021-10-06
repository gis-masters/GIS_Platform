import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { cn } from '@bem-react/classname';

import { Button } from '../../Button/Button';
import { Loading } from '../../Loading/Loading';
import { DataImportTasksList } from '../../DataImportTasksList/DataImportTasksList';
import { services } from '../../../services/services';
import { deleteTask } from '../../../services/geoserver/import/import.service';
import { currentImport } from '../../../stores/CurrentImport.store';

import '!style-loader!css-loader!sass-loader!./DataImport-Dialog.scss';

const cnDataImport = cn('DataImport');

interface DataImportDialogProps {
  open: boolean;
  onClose: () => void;
  nextUrl: string;
}

@observer
export class DataImportDialog extends Component<DataImportDialogProps> {
  @observable private busy = false;

  render() {
    const { open, onClose } = this.props;

    return (
      <Dialog open={open} onClose={onClose}>
        <DialogContent>
          <DialogContentText>
            Некоторые слои будут удалены перед продолжением:
            <br />
          </DialogContentText>
          <DataImportTasksList short onlyErrors className={cnDataImport('DialogTasksList')} />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleNext} color='primary' disabled={this.busy}>
            Продолжить
          </Button>
          <Button onClick={onClose} disabled={this.busy}>
            Отмена
          </Button>
        </DialogActions>
        {this.busy ? <Loading /> : null}
      </Dialog>
    );
  }

  @action.bound
  private handleNext() {
    this.busy = true;
    void this.next();
  }

  private async next() {
    await services.provided;
    await Promise.all(currentImport.errorTasks.map(task => deleteTask(task)));
    await services.router.navigate([this.props.nextUrl], { replaceUrl: true });
  }
}
