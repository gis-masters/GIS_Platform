import React from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
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
export class DataImportDialog extends React.Component<DataImportDialogProps> {
  @observable private busy = false;

  constructor (props: DataImportDialogProps) {
    super(props);
    
    this.handleNext = this.handleNext.bind(this);
  }

  render() {
    const { open, onClose } = this.props;

    return (
      <Dialog open={open}>
        <DialogContent>
          <DialogContentText>
            Некоторые слои будут удалены перед продолжением:<br />
          </DialogContentText>
          <DataImportTasksList short onlyErrors className={cnDataImport('DialogTasksList')} />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleNext} color="primary" variant='outlined' disabled={this.busy}>
            Продолжить
          </Button>
          <Button onClick={onClose} variant='outlined' disabled={this.busy}>
            Отмена
          </Button>
        </DialogActions>
        {this.busy ? <Loading /> : null}
      </Dialog>
    );
  }

  @action
  private handleNext () {
    this.busy = true;
    this.next()
  }

  private async next () {
    await services.provided;
    await Promise.all(currentImport.errorTasks.map(task => deleteTask(task)));
    services.router.navigate([this.props.nextUrl], { replaceUrl: true });
  }
}
