import React, { Component } from 'react';
import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip } from '@mui/material';
import { NoteAddOutlined } from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { DocumentLibrary, getLibrary, getLibraryRecord, LibraryRecord } from '../../services/crg/doc-library.service';
import { convertSchema, getSchemaWithAppliedContentType } from '../../services/crg/schema.utils';
import { getDefaultValues, validateFormValue } from '../../services/crg/formValidation.service';
import { PropertySchema, PropertyType } from '../../services/crg/schema.models';
import { getFeatureUrl } from '../../services/map/map-link-following.service';
import { communicationService } from '../../services/communication.service';
import { schemaService } from '../../services/crg/schema.service';
import { WfsFeature } from '../../services/geoserver/wfs.models';
import { CrgLayer } from '../../services/crg/projects.models';
import { Role } from '../../services/crg/permissions.models';
import { LibraryDocumentActions } from '../LibraryDocumentActions/LibraryDocumentActions.composed';
import { LibraryDocument } from '../LibraryDocument/LibraryDocument';
import { FormDialog } from '../FormDialog/FormDialog';

import { FeatureExtractMapSelector } from './MapSelector/FeatureExtract-MapSelector';

import '!style-loader!css-loader!sass-loader!./FeatureExtract.scss';

const cnFeatureExtract = cn('FeatureExtract');

interface FeatureExtractProps {
  feature: WfsFeature;
  layer: CrgLayer;
}

const libraryIdentifier = 'dl_feature_extract';

@observer
export class FeatureExtract extends Component<FeatureExtractProps> {
  @observable private formDialogOpen = false;
  @observable private documentDialogOpen = false;
  @observable private featureFields: PropertySchema[] = [];
  @observable private document?: LibraryRecord;
  @observable private library?: DocumentLibrary;

  async componentDidMount() {
    const { layer } = this.props;
    this.setLibrary(await getLibrary(libraryIdentifier));
    const featureSchema = await schemaService.getSchema(layer.schemaId);
    this.setFields(convertSchema(featureSchema.properties));

    communicationService.libraryItemsUpdated.on(async () => {
      if (this.document?.id) {
        this.setDocument(await getLibraryRecord(this.document.libraryId, this.document.id, this.document.schemaId));
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
          fields={this.documentFields}
          actionFunction={this.createDocument}
          actionButtonProps={{ children: 'Создать документ' }}
        />

        {this.document && (
          <Dialog open={this.documentDialogOpen} onClose={this.closeDocumentDialog} fullWidth maxWidth='xl'>
            <DialogTitle>{this.document.title}</DialogTitle>
            <DialogContent>
              <LibraryDocument document={this.document} contentOnly />
            </DialogContent>
            <DialogActions>
              <LibraryDocumentActions
                document={this.document}
                as='button'
                hideOpen
                forDialog
                onDialogClose={this.closeDocumentDialog}
                onSave={this.setDocument}
              />
            </DialogActions>
          </Dialog>
        )}
      </>
    );
  }

  @computed
  private get documentFields(): PropertySchema<LibraryRecord>[] {
    const { feature, layer } = this.props;
    const titlePropertyName = this.featureFields.find(({ asTitle }) => asTitle)?.name || 'title';
    const featureTitle = String(feature.properties[titlePropertyName] || '');

    return [
      {
        name: 'title',
        title: 'Название',
        propertyType: PropertyType.STRING,
        defaultValue: `Выписка об объекте "${featureTitle}"`
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
        defaultValue: feature.id.split('.').pop(),
        readOnly: true
      },
      {
        name: 'layer',
        title: 'Слой',
        propertyType: PropertyType.STRING,
        defaultValue: `${layer.title} (${layer.tableName})`,
        readOnly: true
      },
      {
        name: 'feature_url',
        title: 'Ссылка на объект',
        propertyType: PropertyType.STRING,
        defaultValue: getFeatureUrl(feature),
        readOnly: true
      },
      {
        name: 'feature',
        title: 'GeoJSON',
        propertyType: PropertyType.STRING,
        display: 'code',
        defaultValue: JSON.stringify(feature, null, 2),
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
  private setDocument(document: LibraryRecord) {
    this.document = document;
  }

  @action
  private setLibrary(library: DocumentLibrary) {
    this.library = library;
  }

  @boundMethod
  private async createDocument(value: Omit<LibraryRecord, 'schemaId' | 'libraryId'>) {
    const librarySchema = await schemaService.getSchema(this.library.schemaId);
    const libraryFields = convertSchema(getSchemaWithAppliedContentType(librarySchema, 'base_extract').properties);
    const errors = validateFormValue(value, libraryFields);

    if (errors.length) {
      throw errors;
    }

    this.setDocument({
      ...value,
      libraryId: this.library.identifier,
      schemaId: this.library.schemaId,
      role: Role.OWNER
    });
    this.closeFormDialog();
    this.openDocumentDialog();
  }
}
