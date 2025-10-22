import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { AddBoxOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { type LibraryRecord } from '../../services/data/library/library.models';
import { createLibraryRecord } from '../../services/data/library/library.service';
import { type EditedField } from '../../services/data/schema/schemaOld.models';
import { updateProperty } from '../../services/geoserver/wfs/wfs.service';
import { services } from '../../services/services';
import { type EditFeatureInfo } from '../EditFeatureField/EditFeatureField.models';
import { Loading } from '../Loading/Loading';
import { type DocumentListItemData } from './DocumentsList.models';
import { DocumentsListItem } from './Item/DocumentsList-Item';

import './DocumentsList.scss';
import './List/DocumentList-List.scss';
import './Input/DocumentList-Input.scss';
import './Label/DocumentList-Label.scss';
import './Empty/DocumentList-Empty.scss';
import './AddIcon/DocumentList-AddIcon.scss';

const cnDocumentsList = cn('DocumentsList');

export interface DocumentsListProps {
  documents?: DocumentListItemData[];
  editedField: EditedField;
  featureInfo: EditFeatureInfo;
  modifyCallback(payload: DocumentListItemData[]): void;
}

/**
 * @deprecated
 */
@observer
export default class DocumentsList extends Component<DocumentsListProps> {
  @observable private loading = false;

  constructor(props: DocumentsListProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { editedField, documents, featureInfo } = this.props;
    const htmlId = 'icon-button-file-' + editedField.name;
    if (!editedField) {
      return;
    }

    return (
      <div className={cnDocumentsList()}>
        <input
          className={cnDocumentsList('Input')}
          accept='*/*'
          id={htmlId}
          type='file'
          onChange={this.handleFileChange}
        />
        {featureInfo.isReadOnly && (
          <label className={cnDocumentsList('Label')} htmlFor={htmlId}>
            Добавить файл
            <AddBoxOutlined className={cnDocumentsList('AddIcon')} color='primary' fontSize='small' />
          </label>
        )}

        <div className={cnDocumentsList('List', ['scroll'])}>
          {documents &&
            documents.map(document => (
              <DocumentsListItem
                document={document}
                editedField={editedField}
                featureInfo={featureInfo}
                onDelete={this.handleDeletion}
                key={document.id}
              />
            ))}
          {(!documents || !documents.length) && (
            <div className={cnDocumentsList('Empty')}>Нет загруженных документов</div>
          )}
        </div>

        {this.loading ? <Loading /> : null}
      </div>
    );
  }

  @action
  setLoading(isLoading: boolean): void {
    this.loading = isLoading;
  }

  @boundMethod
  private async handleDeletion(id: string) {
    if (this.props.documents) {
      const newDocumentList = this.props.documents.filter(doc => doc.id !== id);

      const { featureInfo, editedField } = this.props;
      await updateProperty(
        featureInfo.layerName,
        featureInfo.feature.id,
        editedField.name,
        JSON.stringify(newDocumentList)
      );

      this.props.modifyCallback(newDocumentList);
    }
  }

  @boundMethod
  private async handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    if (this.loading) {
      return;
    }

    try {
      const selectedFile = e.target.files?.[0];
      if (!selectedFile) {
        return;
      }

      this.setLoading(true);

      const { editedField, featureInfo } = this.props;
      const path = editedField.property.folderId ? `/root/${editedField.property.folderId}` : undefined;
      const crgDocument = await createLibraryRecord(
        {
          content_type_id: 'doc_v2',
          binary: selectedFile,
          title: selectedFile.name,
          category: 'loaded by old way',
          path
        },
        'dl_default'
      );

      if (crgDocument) {
        const payload = this.preparePayload(crgDocument, selectedFile.name);

        await updateProperty(featureInfo.layerName, featureInfo.feature.id, editedField.name, payload);

        this.props.modifyCallback(JSON.parse(payload) as DocumentListItemData[]);
      }
    } catch (error) {
      services.logger.error('Something went wrong: ', error);
    } finally {
      this.setLoading(false);
    }
  }

  private preparePayload(loadedDocument: LibraryRecord, title: string): string {
    return JSON.stringify([...(this.props.documents || []), { id: loadedDocument.id, title }]);
  }
}
