import React, { Component } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip } from '@material-ui/core';
import { boundMethod } from 'autobind-decorator';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { AxiosError } from 'axios';

import { FieldType, PropertySchema } from '../../services/crg/schema.models';
import { DataTable } from '../../services/data.service';
import { createLayer, createLayersGroup } from '../../services/geoserver/layers.service';
import { http } from '../../services/http.service';
import { getApiImportGmlUrl } from '../../services/server-urls.service';
import { currentUser } from '../../stores/CurrentUser.store';
import { scales } from '../../stores/PrintSettings.store';
import { Button } from '../Button/Button';
import { Form } from '../Form/Form';
import { Import } from '../Icons/Import';
import { ImportOutlined } from '../Icons/ImportOutlined';
import { ImportGmlResultDialog } from '../ImportGmlResultDialog/ImportGmlResultDialog';
import { SelectOktmo } from '../SelectOktmo/SelectOktmo';
import { SelectProject } from '../SelectProject/SelectProject';
import { oktmo } from './oktmo';
import { CrgLayerType, CrgProject, NewCrgLayersGroup } from '../../services/crg/projects.models';
import { projectsService } from '../../services/crg/projects.service';
import { FieldErrors, normalizeServerErrors } from '../../services/crg/formValidation.service';

interface ImportGmlFormData extends Record<string, unknown> {
  oktmo: string;
  documentType: string;
  details?: string;
  date: string;
  file: Blob;
  scale: string;
  project?: CrgProject;
  invertCoordinates?: string;
}

export interface TableReport {
  schemaId: string;
  successCount: number;
  success: boolean;
  reason?: string;
  tableIdentifier?: string;
  tableTitle?: string;
}

interface ImportResult {
  importLayerReports: TableReport[];
  datasetIdentifier: string;
  createdTables: DataTable[];
}

const defaultFormData: ImportGmlFormData = {
  date: '',
  documentType: '',
  details: '',
  file: undefined,
  oktmo: '',
  title: '',
  scale: '10000',
  project: undefined,
  invertCoordinates: undefined
};

@observer
export class ImportGml extends Component {
  private createdProject: CrgProject;
  private reports: TableReport[];

  @observable private resultDialogOpen = false;
  @observable private loading = false;
  @observable private formData: ImportGmlFormData = { ...defaultFormData };
  @observable private formDialogOpen = false;
  @observable private formErrors: FieldErrors[] = [];
  @observable private formFields: PropertySchema<ImportGmlFormData>[] = [
    { name: 'details', title: 'Описание', fieldType: FieldType.STRING },
    { name: 'date', title: 'Дата утверждения документа', fieldType: FieldType.DATETIME, required: true },
    {
      name: 'documentType',
      title: 'Тип документа',
      fieldType: FieldType.CHOICE,
      options: [
        { value: 'Генеральный план', title: 'Генеральный план' },
        { value: 'СТП  муниципальных районов', title: 'СТП  муниципальных районов' },
        { value: 'СТП  субъектов Российской Федерации', title: 'СТП  субъектов Российской Федерации' }
      ]
    },
    {
      name: 'oktmo',
      title: 'ОКТМО',
      fieldType: FieldType.CUSTOM,
      ControlComponent: SelectOktmo,
      required: true
    },
    {
      name: 'scale',
      title: 'Номинальный масштаб',
      fieldType: FieldType.CHOICE,
      required: true,
      options: scales.map(scale => ({ title: `1 : ${scale}`, value: scale }))
    },
    { name: 'file', title: 'Файл', fieldType: FieldType.BINARY, accept: '.gml', required: true },
    {
      name: 'project',
      title: 'Добавить в',
      fieldType: FieldType.CUSTOM,
      ControlComponent: SelectProject
    },
    { name: 'invertCoordinates', title: 'Инвертировать координаты', fieldType: FieldType.BOOL }
  ];

  render() {
    const project = this.formData.project || this.createdProject;

    return (
      <>
        <Tooltip title='Импорт GML по 10 приказу'>
          <IconButton onClick={this.openFormDialog}>{this.formDialogOpen ? <Import /> : <ImportOutlined />}</IconButton>
        </Tooltip>
        <Dialog open={this.formDialogOpen} onClose={this.closeFormDialog}>
          <DialogTitle>Импорт GML по 10 приказу</DialogTitle>
          <DialogContent>
            <Form<ImportGmlFormData>
              id='importGmlForm'
              fields={this.formFields}
              errors={this.formErrors}
              onFormSubmit={this.submitHandler}
              onFormChange={this.onChangeHandler}
              onFieldChange={this.formFieldChanged}
              value={this.formData}
            />
          </DialogContent>
          <DialogActions>
            <Button form='importGmlForm' type='submit' color='primary' disabled={this.loading}>
              Импортировать
            </Button>
            <Button onClick={this.closeFormDialog}>Отмена</Button>
          </DialogActions>
        </Dialog>
        <ImportGmlResultDialog
          open={this.resultDialogOpen}
          onClose={this.closeResultDialog}
          projectIsNew={!this.formData.project}
          project={project}
          reports={this.reports}
        />
      </>
    );
  }

  @action.bound
  private openFormDialog() {
    this.formDialogOpen = true;
    this.formData.oktmo = undefined;
    this.formData.documentType = undefined;
    this.formData.details = undefined;
    this.formData.gmlFile = undefined;
    this.formData.invertCoordinates = undefined;
    this.formData.date = undefined;
    this.formData.scale = '10000';
    this.formData.project = undefined;
  }

  @action.bound
  private closeFormDialog() {
    this.formDialogOpen = false;
    this.reset();
  }

  @boundMethod
  private async submitHandler(data: ImportGmlFormData) {
    this.setLoading(true);
    const formData = new FormData();
    const oktmoTitle = oktmo.find(o => o.value === String(data.oktmo))?.title;
    const year = new Date(data.date).getFullYear();

    const title = `${data.documentType} ${oktmoTitle} ${year} ${Number(data.scale) / 1000}K`;

    formData.append('oktmo', data.oktmo);
    formData.append('documentType', data.documentType);
    formData.append('details', data.details);
    formData.append('docDateApprove', data.date);
    formData.append('gmlFile', data.file);
    formData.append('scale', data.scale);
    formData.append('title', title);
    if (data.invertCoordinates) {
      formData.append('invertCoordinates', data.invertCoordinates);
    }

    try {
      const { createdTables, datasetIdentifier, importLayerReports } = await http.post<ImportResult>(
        await getApiImportGmlUrl(),
        formData
      );

      this.reports = importLayerReports;

      const newGroup: NewCrgLayersGroup = {
        title: title,
        enabled: false,
        expanded: true,
        transparency: 100,
        position: -1
      };

      let createdGroupId: number | undefined;

      if (data.project) {
        createdGroupId = (await createLayersGroup(newGroup, data.project)).id;
      } else {
        this.createdProject = await projectsService.create(title);
      }

      for (const table of createdTables) {
        const dataStoreName = `scratch_database_${currentUser.orgId}`;

        await createLayer(
          {
            dataStoreName,
            title: table.title,
            complexName: `${dataStoreName}:${table.identifier}`,
            enabled: false,
            nativeCRS: table.crs,
            dataset: datasetIdentifier,
            tableName: table.identifier,
            type: CrgLayerType.VECTOR,
            schemaId: table.schemaId,
            styleName: table.schemaId,
            position: -42,
            transparency: 70,
            parentId: createdGroupId
          },
          data.project ? data.project : this.createdProject
        );
      }

      this.openResultDialog();
      this.closeFormDialog();
      this.reset();
    } catch (error) {
      const err = error as AxiosError<{ errors?: FieldErrors[] }>;
      if (err?.response?.data?.errors) {
        this.setFormErrors(normalizeServerErrors(err.response.data.errors));
      }
    }

    this.setLoading(false);
  }

  @action.bound
  private onChangeHandler(changedValue: ImportGmlFormData) {
    Object.assign(this.formData, changedValue);
  }

  @action
  private setLoading(loading: boolean) {
    this.loading = loading;
  }

  @action
  private reset() {
    this.loading = false;
  }

  @action.bound
  private openResultDialog() {
    this.resultDialogOpen = true;
  }

  @action.bound
  private closeResultDialog() {
    this.resultDialogOpen = false;
  }

  @action
  private setFormErrors(errors: FieldErrors[]) {
    this.formErrors = errors;
  }

  @boundMethod
  private formFieldChanged(value: unknown, fieldName: string) {
    this.setFormErrors(this.formErrors?.filter(({ field }) => field !== fieldName));
  }
}
