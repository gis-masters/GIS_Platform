import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

import { Projection } from '../../services/data/projections/projections.models';
import { getProjectionByCode } from '../../services/data/projections/projections.service';
import { Button } from '../Button/Button';
import { SelectProjection } from '../SelectProjection/SelectProjection';
import { Toast } from '../Toast/Toast';

interface SelectProjectionDialogProps {
  defaultCrs: string;
  open: boolean;
  onSelect(proj: Projection): void;
  onClose(): void;
}

@observer
export class SelectProjectionDialog extends Component<SelectProjectionDialogProps> {
  @observable private projection?: Projection;

  constructor(props: SelectProjectionDialogProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount(): Promise<void> {
    const { defaultCrs } = this.props;
    const projection = await getProjectionByCode(defaultCrs);
    if (projection) {
      this.setSelectedProjection(projection);
    }
  }

  render() {
    const { open, onClose } = this.props;

    return (
      <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
        <DialogTitle>Выбор системы координат</DialogTitle>
        <DialogContent>
          <SelectProjection onChange={this.setSelectedProjection} fullWidth value={this.projection} />
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

    if (!this.projection) {
      Toast.error('Ошибка сохранения. Выбранная проекция не найдена');

      return;
    }

    onSelect?.(this.projection);
    onClose?.();
  }

  @action.bound
  private setSelectedProjection(projection: Projection) {
    this.projection = projection;
  }
}
