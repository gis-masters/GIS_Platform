import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

import { Epsg } from '../../services/data/epsg/epsg.models';
import { getEpsgByCrs } from '../../services/data/epsg/epsg.service';
import { Button } from '../Button/Button';
import { SelectEpsg } from '../SelectEpsg/SelectEpsg';
import { Toast } from '../Toast/Toast';

interface SelectEpsgDialogProps {
  defaultCrs: string;
  open: boolean;
  onSelect: (epsg: Epsg) => void;
  onClose(): void;
}

@observer
export class SelectEpsgDialog extends Component<SelectEpsgDialogProps> {
  @observable private epsg?: Epsg;

  constructor(props: SelectEpsgDialogProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount(): Promise<void> {
    const { defaultCrs } = this.props;
    const epsg = await getEpsgByCrs(defaultCrs);

    if (epsg) {
      this.setSelectedProjection(epsg);
    }
  }

  render() {
    const { open, onClose } = this.props;

    return (
      <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
        <DialogTitle>Выбор системы координат</DialogTitle>
        <DialogContent>
          <SelectEpsg onSelect={this.setSelectedProjection} formView fullWidth defaultEpsg={this.epsg} />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.save} color='primary'>
            Выбрать
          </Button>
          <Button onClick={onClose}>Отмена</Button>
        </DialogActions>
      </Dialog>
    );
  }

  @action.bound
  private save() {
    const { onSelect, onClose } = this.props;

    if (!this.epsg) {
      Toast.error('Ошибка сохранения. Выбранная проекция не найдена');

      return;
    }

    if (onSelect && onClose) {
      onSelect(this.epsg);
      onClose();
    }
  }

  @action.bound
  private setSelectedProjection(projection: Epsg) {
    this.epsg = projection;
  }
}
