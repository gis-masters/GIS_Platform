import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { action, computed, observable, makeObservable } from 'mobx';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent
} from '@mui/material';

import { Form } from '../Form/Form';
import { Button } from '../Button/Button';
import { XTableColumn } from '../XTable/XTable';
import { PageOptions } from '../../services/models';
import { LayersList } from '../LayersList/LayersList';
import { sidebars } from '../../stores/Sidebars.store';
import { getKnownEpsg } from '../../services/data/epsg.service';
import { PropertyType } from '../../services/data/schema.models';
import { CoordinateAxes } from '../CoordinateAxes/CoordinateAxes';
import { currentProject } from '../../stores/CurrentProject.store';
import { CrgVectorLayer } from '../../services/gis/projects.models';
import { DialogActionsLeft } from '../DialogActionsLeft/DialogActionsLeft';
import { ChooseXTableDialog } from '../ChooseXTableDialog/ChooseXTableDialog';
import { DialogActionsRight } from '../DialogActionsRight/DialogActionsRight';
import { XTableNumberFilter } from '../XTable/NumberFilter/XTable-NumberFilter';
import { ExportResourceModel, exportService } from '../../services/data/export.service';
import { CrgProjection, Projection, viewedProjections } from '../../services/geoserver/projections.service';

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

interface ProjectionModified extends Projection {
  auth_srid: number;
}

@observer
export class ExportGmlDialog extends Component<ExportGmlDialogProps> {
  @observable private projectionDialogOpen = false;
  @observable private selectedLayers: CrgVectorLayer[] = [];
  @observable private selectedSchema = '';
  @observable private selectedCrs = 'EPSG:28406';
  @observable private invertedCoordinates = false;
  @observable private projections: CrgProjection[] = [];

  private readonly addMoreId = 'addMore';

  private cols: XTableColumn<ProjectionModified>[] = [
    {
      field: 'authName',
      title: 'Тип SRID'
    },
    {
      field: 'auth_srid',
      title: 'Код SRID',
      type: PropertyType.INT,
      CustomFilterComponent: XTableNumberFilter,
      filterable: true,
      sortable: true
    }
  ];

  constructor(props: ExportGmlDialogProps) {
    super(props);
    makeObservable(this);

    this.setProjections(viewedProjections);
    this.addProjection({ id: this.addMoreId, title: 'Выбрать другую' });
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
            <DialogActionsLeft>
              <CoordinateAxes onSelect={this.handleSelect} invertedCoordinates={this.invertedCoordinates} />

              <FormControl className={cnExportGmlDialog('EpsgSelector')} size='small'>
                <InputLabel id='epsgSelectLabel'>Система координат</InputLabel>
                <Select
                  size='small'
                  labelId='epsgSelectLabel'
                  value={this.selectedCrs}
                  variant='standard'
                  onChange={this.handleChange}
                >
                  {this.projections.map((projection, key) => (
                    <MenuItem value={projection.id} key={key}>
                      {projection.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </DialogActionsLeft>

            <DialogActionsRight>
              <Button type='submit' form='exportGmlForm' color='primary' disabled={this.exportNotAllowed}>
                Экспорт
              </Button>
              <Button onClick={this.closeDialog}>Отмена</Button>
            </DialogActionsRight>
          </DialogActions>
        </Dialog>

        <ChooseXTableDialog<ProjectionModified>
          data={[]}
          getData={this.getProjections}
          title={'Выбор системы координат'}
          open={this.projectionDialogOpen}
          cols={this.cols}
          getRowId={this.getRowId}
          onClose={this.closeProjectionDialog}
          onSelect={this.selectProjectionFromDialog}
          single
        />
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
        table: layer.tableName,
        schemaId: layer.schemaId
      };
    });

    await exportService.exportAsGML(this.selectedSchema, resources, this.selectedCrs, this.invertedCoordinates);

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
  private setProjectionDialogOpen(projectionDialogOpen: boolean) {
    this.projectionDialogOpen = projectionDialogOpen;
  }

  @action.bound
  private closeProjectionDialog() {
    this.setProjectionDialogOpen(false);
  }

  @action.bound
  private handleSchemaChange(e: SelectChangeEvent) {
    this.selectedSchema = e.target.value;
  }

  @action.bound
  private selectProjectionFromDialog(proj: Projection[]) {
    const id = [proj[0].authName, proj[0].authSrid].join(':');

    this.unshiftProjection({
      id,
      title: id
    });

    this.selectedCrs = this.projections[0].id;

    this.setProjectionDialogOpen(false);
  }

  @action.bound
  private handleChange(e: SelectChangeEvent) {
    if (e.target.value === this.addMoreId) {
      this.setProjectionDialogOpen(true);
    } else {
      this.selectedCrs = e.target.value;
    }
  }

  @action.bound
  private closeDialog() {
    this.selectedLayers = [];
    this.selectedSchema = '';

    this.props.onClose();
  }

  @action.bound
  private addProjection(projection: CrgProjection) {
    const isExist = this.projections.find(proj => proj.id === projection.id);
    if (!isExist) {
      this.projections.push(projection);
    }
  }

  @action.bound
  private unshiftProjection(projection: CrgProjection) {
    const isExist = this.projections.find(proj => proj.id === projection.id);
    if (!isExist) {
      this.projections.unshift(projection);
    }
  }

  @action.bound
  private setProjections(projections: CrgProjection[]) {
    this.projections = projections;
  }

  private async getProjections(pageOptions: PageOptions): Promise<[ProjectionModified[], number]> {
    const [projections, totalPages] = await getKnownEpsg(pageOptions);

    const modifiedProjections: ProjectionModified[] = projections.map(proj => ({
      ...proj,
      auth_srid: proj.authSrid
    }));

    return [modifiedProjections, totalPages];
  }

  private getRowId(rowData: Projection) {
    return rowData.authName + String(rowData.authSrid);
  }
}
