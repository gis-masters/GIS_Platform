import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogContentText } from '@mui/material';
import { cn } from '@bem-react/classname';

import { deleteTask } from '../../../services/geoserver/import/import.service';
import { services } from '../../../services/services';
import { currentImport } from '../../../stores/CurrentImport.store';
import { Button } from '../../Button/Button';
import { DataImportTasksList } from '../../DataImportTasksList/DataImportTasksList';
import { Loading } from '../../Loading/Loading';

import '!style-loader!css-loader!sass-loader!./DataImport-Dialog.scss';

const cnDataImport = cn('DataImport');

interface DataImportDialogProps {
  open: boolean;
  onClose(): void;
  nextUrl: string;
}

@observer
export class DataImportDialog extends Component<DataImportDialogProps> {
  @observable private busy = false;

  constructor(props: DataImportDialogProps) {
    super(props);
    makeObservable(this);
  }

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
