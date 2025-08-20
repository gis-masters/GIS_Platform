import React, { Component } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { getExportValidationReport } from '../../services/data/validation/validation.service';
import { CrgVectorLayer } from '../../services/gis/layers/layers.models';
import { sidebars } from '../../stores/Sidebars.store';
import { Button } from '../Button/Button';
import { Form } from '../Form/Form';
import { LayersList } from '../LayersList/LayersList';

const cnExportValidationReportDialog = cn('ExportValidationReportDialog');

export interface ExportValidationReportDialogProps {
  layers: CrgVectorLayer[];
  open: boolean;
  onClose(): void;
}

@observer
export default class ExportValidationReportDialog extends Component<ExportValidationReportDialogProps> {
  @observable private selectedLayers: CrgVectorLayer[] = [];

  constructor(props: ExportValidationReportDialogProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { open, layers } = this.props;

    return (
      <Dialog className={cnExportValidationReportDialog()} maxWidth={'md'} open={open}>
        <DialogTitle className={cnExportValidationReportDialog('Title')}>
          Экспорт отчета об ошибках
          <div className={cnExportValidationReportDialog('Total')}>Всего выбрано: {this.selectedLayers.length}</div>
        </DialogTitle>

        <DialogContent className={cnExportValidationReportDialog('Content')}>
          <Form
            className={cnExportValidationReportDialog('Form')}
            id='exportValidationReportForm'
            onSubmit={this.executeExport}
          >
            <LayersList layers={layers} onSelect={this.onSelect} />
          </Form>
        </DialogContent>

        <DialogActions>
          <Button type='submit' form='exportValidationReportForm' color='primary' disabled={this.exportNotAllowed}>
            Экспорт
          </Button>
          <Button onClick={this.closeDialog}>Отмена</Button>
        </DialogActions>
      </Dialog>
    );
  }

  @boundMethod
  private async executeExport(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    await getExportValidationReport(this.selectedLayers);

    this.closeDialog();
    sidebars.openInfo();
  }

  @computed
  private get exportNotAllowed() {
    return !this.selectedLayers.length;
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
