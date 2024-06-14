import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { communicationService } from '../../services/communication.service';
import { initValidation } from '../../services/data/validation/validation.service';
import { CrgVectorLayer } from '../../services/gis/layers/layers.models';
import { currentProject } from '../../stores/CurrentProject.store';
import { sidebars } from '../../stores/Sidebars.store';
import { Button } from '../Button/Button';
import { LayersList } from '../LayersList/LayersList';
import { Toast } from '../Toast/Toast';

import '!style-loader!css-loader!sass-loader!./ValidateLayersDialog.scss';

const cnValidateLayersDialog = cn('ValidateLayersDialog');

export interface ValidateLayersDialogProps {
  open: boolean;
  onClose(): void;
}

@observer
export default class ValidateLayersDialog extends Component<ValidateLayersDialogProps> {
  @observable private selectedLayers: CrgVectorLayer[] = [];

  constructor(props: ValidateLayersDialogProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { open } = this.props;

    return (
      <Dialog className={cnValidateLayersDialog()} maxWidth={'md'} open={open}>
        <DialogTitle className={cnValidateLayersDialog('Title')}>
          <span>Проверка данных</span>
          <div className={cnValidateLayersDialog('Total')}>Всего выбрано: {this.selectedLayers.length}</div>
        </DialogTitle>

        <DialogContent className={cnValidateLayersDialog('Content')}>
          <LayersList layers={currentProject.vectorLayers} onSelect={this.onSelect} />
        </DialogContent>

        <DialogActions>
          <Button color='primary' disabled={!this.selectedLayers.length} onClick={this.executeValidation}>
            Проверить
          </Button>
          <Button onClick={this.closeDialog}>Отмена</Button>
        </DialogActions>
      </Dialog>
    );
  }

  @boundMethod
  private async executeValidation() {
    try {
      await initValidation(this.selectedLayers);
    } catch {
      Toast.error('Ошибка проверки данных');
      communicationService.validationInitiated.emit(false);
    } finally {
      this.closeDialog();
      sidebars.openBugReport();
      communicationService.validationInitiated.emit(true);
    }
  }

  @action.bound
  private onSelect(layers: CrgVectorLayer[]) {
    this.selectedLayers = layers;
  }

  @action.bound
  private closeDialog() {
    this.selectedLayers = [];

    this.props.onClose();
  }
}
