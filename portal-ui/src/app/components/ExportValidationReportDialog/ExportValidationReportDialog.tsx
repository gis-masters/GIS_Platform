import React, { Component } from 'react';
import { action, computed, observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { boundMethod } from 'autobind-decorator';

import { exportValidationReportService } from '../../services/data/export-validation-report.service';
import { ExportResourceModel } from '../../services/data/export.service';
import { CrgVectorLayer } from '../../services/gis/projects.models';
import { sidebars } from '../../stores/Sidebars.store';
import { LayersList } from '../LayersList/LayersList';
import { Button } from '../Button/Button';
import { Form } from '../Form/Form';

const cnExportValidationReportDialog = cn('ExportValidationReportDialog');

interface ExportValidationReportDialogProps {
  layers: CrgVectorLayer[];
  open: boolean;
  onClose: () => void;
}

@observer
export class ExportValidationReportDialog extends Component<ExportValidationReportDialogProps> {
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

    const resources: ExportResourceModel[] = this.selectedLayers.map(layer => {
      return {
        dataset: layer.dataset,
        table: layer.tableName,
        schemaId: layer.schemaId
      };
    });

    await exportValidationReportService.exportValidationReport(resources);

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
