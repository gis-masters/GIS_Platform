import React, { Component } from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { boundMethod } from 'autobind-decorator';

import { sidebars } from '../../stores/Sidebars.store';
import { currentProject } from '../../stores/CurrentProject.store';
import { communicationService } from '../../services/communication.service';
import { validationService } from '../../services/crg/validation.service';
import { CrgVectorLayer } from '../../services/crg/projects.models';
import { LayersList } from '../LayersList/LayersList';
import { Button } from '../Button/Button';
import { Toast } from '../Toast/Toast';

import '!style-loader!css-loader!sass-loader!./ValidateLayersDialog.scss';

const cnValidateLayersDialog = cn('ValidateLayersDialog');

interface ValidateLayersDialogProps {
  open: boolean;
  onClose: () => void;
}

@observer
export class ValidateLayersDialog extends Component<ValidateLayersDialogProps> {
  @observable private selectedLayers: CrgVectorLayer[] = [];

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
      await validationService.initValidation(this.selectedLayers);
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
