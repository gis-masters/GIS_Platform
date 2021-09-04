import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { action, computed, observable } from 'mobx';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { Dialog, DialogActions, DialogContent, DialogTitle, InputLabel, MenuItem, Select } from '@material-ui/core';

import { Form } from '../Form/Form';
import { Button } from '../Button/Button';
import { LayersList } from '../LayersList/LayersList';
import { sidebars } from '../../stores/Sidebars.store';
import { CrgLayer } from '../../services/crg/projects.models';
import { ExportResourceModel, exportService } from '../../services/crg/export.service';
import { currentProject } from '../../stores/CurrentProject.store';

import '!style-loader!css-loader!sass-loader!./ExportGmlDialog.scss';

const cnExportGmlDialog = cn('ExportGmlDialog');

interface SpatialPlanningSchema {
  value: string;
  title: string;
}

const knownSchemas: SpatialPlanningSchema[] = [
  {
    value: 'Doc.10501010100',
    title: 'Положение о территориальном планировании в области федерального транспорта'
  },
  {
    value: 'Doc.10502010100',
    title:
      'Положение о территориальном планировании в области федерального транспорта ' +
      '(в части трубопроводного транспорта)'
  },
  {
    value: 'Doc.10504010100',
    title: 'Положение о территориальном планировании в области энергетики'
  },
  {
    value: 'Doc.10505010100',
    title: 'Положение о территориальном планировании в области высшего образования'
  },
  {
    value: 'Doc.10506010100',
    title: 'Положение о территориальном планировании в области здравоохранения'
  },
  {
    value: 'Doc.10803010100',
    title: 'Положение о территориальном планировании субъекта Российской Федерации'
  },
  {
    value: 'Doc.20101010000',
    title: 'Положение о территориальном планировании муниципального района'
  },
  {
    value: 'Doc.20201010000',
    title: 'Положение о территориальном планировании поселения'
  },
  {
    value: 'Doc.20301010000',
    title: 'Положение о территориальном планировании городского округа'
  }
];

interface ExportGmlDialogProps {
  open: boolean;
  onClose: () => void;
}

@observer
export class ExportGmlDialog extends Component<ExportGmlDialogProps> {
  @observable private dialogOpen = false;
  @observable private selectedLayers: CrgLayer[] = [];
  @observable private selectedSchema = '';

  render() {
    const { open } = this.props;

    return (
      <Dialog className={cnExportGmlDialog()} maxWidth={'md'} open={open}>
        <DialogTitle className={cnExportGmlDialog('Title')}>
          <span>Экспорт GML</span>
          <div className={cnExportGmlDialog('Total')}>Всего выбрано: {this.selectedLayers.length}</div>
        </DialogTitle>

        <DialogContent className={cnExportGmlDialog('Content')}>
          <Form className={cnExportGmlDialog('Form')} id='exportGmlForm' onSubmit={this.executeExport}>
            <InputLabel id='schema-select-id'>Схемы территориального планирования</InputLabel>
            <Select
              className={cnExportGmlDialog('SchemaSelector')}
              labelId='schema-select-id'
              value={this.selectedSchema}
              onChange={this.handleSchemaChange}
            >
              {knownSchemas.map(schema => (
                <MenuItem key={schema.value} value={schema.value}>
                  {schema.title}
                </MenuItem>
              ))}
            </Select>
          </Form>

          <LayersList layers={currentProject.vectorLayers} onSelect={this.onSelect} />
        </DialogContent>

        <DialogActions>
          <Button type='submit' form='exportGmlForm' color='primary' disabled={this.exportNotAllowed}>
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

    await exportService.exportAsGML(this.selectedSchema, resources);

    this.closeDialog();
    sidebars.openInfo();
  }

  @computed
  private get exportNotAllowed() {
    return !this.selectedSchema || !this.selectedLayers.length;
  }

  @action.bound
  private onSelect(layers: CrgLayer[]) {
    this.selectedLayers = layers;
  }

  @action.bound
  private handleSchemaChange(e: React.ChangeEvent<SpatialPlanningSchema>) {
    this.selectedSchema = e.target.value;
  }

  @action.bound
  private closeDialog() {
    this.selectedLayers = [];
    this.selectedSchema = '';

    this.props.onClose();
  }
}
