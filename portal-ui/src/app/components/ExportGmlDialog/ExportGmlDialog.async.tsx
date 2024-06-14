import React, { Component } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent
} from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { ExportResourceModel } from '../../services/data/export/export.models';
import { exportVectorTableAsGML } from '../../services/data/export/export.service';
import { Projection } from '../../services/data/projections/projections.models';
import { getProjectionCode } from '../../services/data/projections/projections.util';
import { CrgVectorLayer } from '../../services/gis/layers/layers.models';
import { currentProject } from '../../stores/CurrentProject.store';
import { projectionsStore } from '../../stores/Projections.store';
import { sidebars } from '../../stores/Sidebars.store';
import { ActionsLeft } from '../ActionsLeft/ActionsLeft';
import { ActionsRight } from '../ActionsRight/ActionsRight';
import { Button } from '../Button/Button';
import { CoordinateAxes } from '../CoordinateAxes/CoordinateAxes';
import { Form } from '../Form/Form';
import { LayersList } from '../LayersList/LayersList';
import { SelectProjection } from '../SelectProjection/SelectProjection';

import '!style-loader!css-loader!sass-loader!./ExportGmlDialog.scss';

const cnExportGmlDialog = cn('ExportGmlDialog');

interface SpatialPlanningSchema {
  value: string;
  title: string;
}

const knownSchemas: SpatialPlanningSchema[] = [
  {
    value: 'Doc.20201010000',
    title: 'Проекты генеральных планов поселений и генеральных планов городских округов'
  },
  {
    value: 'Doc.20204010000',
    title: 'Генеральные планы поселений и генеральные планы городских округов'
  },
  {
    value: 'Doc.20201010314',
    title: 'Наша дополненная схема'
  },
  {
    value: 'Doc.20201010315',
    title: 'Проекты генеральных планов поселений и генеральных планов городских округов с зонами'
  }
];

export interface ExportGmlDialogProps {
  open: boolean;
  onClose(): void;
}

@observer
export default class ExportGmlDialog extends Component<ExportGmlDialogProps> {
  @observable private selectedLayers: CrgVectorLayer[] = [];
  @observable private selectedSchema = '';
  @observable private invertedCoordinates = false;
  @observable private projection?: Projection;

  constructor(props: ExportGmlDialogProps) {
    super(props);
    makeObservable(this);
  }

  componentDidMount(): void {
    if (projectionsStore.defaultProjection) {
      this.setProjection(projectionsStore.defaultProjection);
    }
  }

  render() {
    const { open } = this.props;

    return (
      <>
        <Dialog className={cnExportGmlDialog()} maxWidth={'md'} fullWidth open={open}>
          <DialogTitle className={cnExportGmlDialog('Title')}>
            <span>Экспорт GML</span>
            <div className={cnExportGmlDialog('Total')}>Всего выбрано: {this.selectedLayers.length}</div>
          </DialogTitle>

          <DialogContent>
            <Form className={cnExportGmlDialog('Form')} id='exportGmlForm' onSubmit={this.executeExport}>
              <InputLabel id='schema-select-id'>Схемы территориального планирования</InputLabel>
              <Select
                className={cnExportGmlDialog('SchemaSelector')}
                labelId='schema-select-id'
                value={this.selectedSchema}
                onChange={this.handleSchemaChange}
                variant='standard'
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
            <ActionsLeft>
              <CoordinateAxes onSelect={this.handleSelect} invertedCoordinates={this.invertedCoordinates} />
              <SelectProjection value={this.projection} onChange={this.setProjection} />
            </ActionsLeft>

            <ActionsRight>
              <Button type='submit' form='exportGmlForm' color='primary' disabled={this.exportNotAllowed}>
                Экспорт
              </Button>
              <Button onClick={this.closeDialog}>Отмена</Button>
            </ActionsRight>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  @boundMethod
  private handleSelect(inverted: boolean) {
    this.invertedCoordinates = inverted;
  }

  @boundMethod
  private async executeExport(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const resources: ExportResourceModel[] = this.selectedLayers.map(layer => {
      return {
        dataset: layer.dataset,
        table: layer.tableName
      };
    });

    if (this.projection) {
      await exportVectorTableAsGML(
        this.selectedSchema,
        resources,
        getProjectionCode(this.projection),
        this.invertedCoordinates
      );
    }

    this.closeDialog();
    sidebars.openInfo();
  }

  @computed
  private get exportNotAllowed() {
    return !this.selectedSchema || !this.selectedLayers.length;
  }

  @action.bound
  private onSelect(layers: CrgVectorLayer[]) {
    this.selectedLayers = layers;
  }

  @action.bound
  private handleSchemaChange(e: SelectChangeEvent) {
    this.selectedSchema = e.target.value;
  }

  @action.bound
  private closeDialog() {
    this.selectedLayers = [];
    this.selectedSchema = '';

    this.props.onClose();
  }

  @action.bound
  private setProjection(projection: Projection) {
    this.projection = projection;
  }
}
