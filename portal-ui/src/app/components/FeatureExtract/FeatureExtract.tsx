import React, { Component } from 'react';
import { action, computed, observable, makeObservable } from 'mobx';
import { NoteAddOutlined } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';
import { observer } from 'mobx-react';
import { AxiosError } from 'axios';

import { Library, LibraryRecord, LibraryRecordNew } from '../../services/data/library/library.models';
import { getLibrary, getLibraryRecord } from '../../services/data/library/library.service';
import { PropertySchema, PropertyType } from '../../services/data/schema/schema.models';
import { LibraryDocumentDialog } from '../LibraryDocumentDialog/LibraryDocumentDialog';
import { communicationService } from '../../services/communication.service';
import { applyContentType } from '../../services/data/schema/schema.utils';
import { validateFormValue } from '../../services/formValidation.service';
import { schemaService } from '../../services/data/schema/schema.service';
import { Role } from '../../services/data/permissions/permissions.models';
import { CrgVectorLayer } from '../../services/gis/layers/layers.models';
import { getLayerSchema } from '../../services/gis/layers/layers.service';
import { WfsFeature } from '../../services/geoserver/wfs/wfs.models';
import { currentProject } from '../../stores/CurrentProject.store';
import { getFeaturesUrl } from '../../services/map/map.util';
import { getDefaultValues } from '../Form/Form.utils';
import { FormDialog } from '../FormDialog/FormDialog';
import { services } from '../../services/services';

import { FeatureExtractMapSelector } from './MapSelector/FeatureExtract-MapSelector';

const cnFeatureExtract = cn('FeatureExtract');

interface FeatureExtractProps {
  feature: WfsFeature;
  layer: CrgVectorLayer;
}

const libraryTableName = 'dl_feature_extract';

@observer
export class FeatureExtract extends Component<FeatureExtractProps> {
  @observable private formDialogOpen = false;
  @observable private documentDialogOpen = false;
  @observable private featureFields: PropertySchema[] = [];
  @observable private document?: LibraryRecord | LibraryRecordNew;
  @observable private library?: Library;

  constructor(props: FeatureExtractProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    const { layer } = this.props;
    try {
      this.setLibrary(await getLibrary(libraryTableName));
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;

      services.logger.warn(`Ошибка доступа к библиотеке документов ${libraryTableName}. [${err.message}]`, error);
    }
    const featureSchema = await getLayerSchema(layer);
    this.setFields(featureSchema.properties);

    communicationService.libraryRecordUpdated.on(async () => {
      if (typeof this.document?.id === 'number') {
        this.setDocument(await getLibraryRecord(this.library.table_name, this.document.id));
      }
    }, this);
  }

  componentWillUnmount() {
    communicationService.off(this);
  }

  render() {
    return (
      <>
        <Tooltip title='Создать выписку'>
          <IconButton className={cnFeatureExtract()} onClick={this.openFormDialog}>
            <NoteAddOutlined />
          </IconButton>
        </Tooltip>

        <FormDialog<LibraryRecord>
          open={this.formDialogOpen}
          value={this.value}
          onClose={this.closeFormDialog}
          schema={{ properties: this.documentFields }}
          actionFunction={this.createDocument}
          actionButtonProps={{ children: 'Создать документ' }}
        />

        {this.document?.id && (
          <LibraryDocumentDialog
            document={this.document as LibraryRecord}
            open={this.documentDialogOpen}
            onClose={this.closeDocumentDialog}
          />
        )}
      </>
    );
  }

  @computed
  private get documentFields(): PropertySchema[] {
    if (!currentProject.vectorLayers.length) {
      return [];
    }

    const { feature, layer } = this.props;
    const titlePropertyName = this.featureFields.find(({ asTitle }) => asTitle)?.name || 'title';
    const featureTitle = String(feature.properties[titlePropertyName] || '');

    return [
      {
        name: 'title',
        title: 'Название',
        propertyType: PropertyType.STRING,
        defaultValueFormula: () => `Выписка об объекте "${featureTitle}"`
      },
      {
        name: 'map',
        title: 'Карта',
        required: true,
        propertyType: PropertyType.CUSTOM,
        defaultValue: [],
        ControlComponent: FeatureExtractMapSelector
      },
      {
        name: 'feature_id',
        title: 'ID объекта',
        propertyType: PropertyType.STRING,
        defaultValueFormula: () => feature.id.split('.').pop(),
        readOnly: true
      },
      {
        name: 'layer',
        title: 'Слой',
        propertyType: PropertyType.STRING,
        defaultValueFormula: () => `${layer.title} (${layer.tableName})`,
        readOnly: true
      },
      {
        name: 'feature_url',
        title: 'Ссылка на объект',
        propertyType: PropertyType.STRING,
        defaultValueFormula: () => getFeaturesUrl(currentProject.id, layer.dataset, layer.tableName, [feature.id]),
        readOnly: true
      },
      {
        name: 'feature',
        title: 'GeoJSON',
        propertyType: PropertyType.STRING,
        display: 'code',
        defaultValueFormula: () => JSON.stringify(feature, null, 2),
        readOnly: true
      },
      {
        name: 'content_type_id',
        title: 'Идентификатор контент типа',
        propertyType: PropertyType.STRING,
        required: true,
        hidden: true,
        defaultValue: 'base_extract'
      }
    ];
  }

  @computed
  private get value(): Partial<LibraryRecord> {
    return getDefaultValues<LibraryRecord>(this.documentFields);
  }

  @action.bound
  private openFormDialog() {
    this.formDialogOpen = true;
  }

  @action.bound
  private closeFormDialog() {
    this.formDialogOpen = false;
  }

  @action
  private openDocumentDialog() {
    this.documentDialogOpen = true;
  }

  @action.bound
  private closeDocumentDialog() {
    this.documentDialogOpen = false;
  }

  @action
  private setFields(fields: PropertySchema[]) {
    this.featureFields = fields;
  }

  @action.bound
  private setDocument(document: LibraryRecordNew) {
    this.document = document;
  }

  @action
  private setLibrary(library: Library) {
    this.library = library;
  }

  @boundMethod
  private async createDocument(value: LibraryRecordNew) {
    const librarySchema = await schemaService.getSchema(this.library.schemaId);
    const libraryFields = applyContentType(librarySchema, 'base_extract').properties;
    const errors = validateFormValue(value, libraryFields);

    if (errors.length) {
      throw errors;
    }

    this.setDocument({
      ...value,
      libraryTableName: this.library.table_name,
      schemaId: this.library.schemaId,
      role: Role.OWNER
    });
    this.closeFormDialog();
    this.openDocumentDialog();
  }
}
