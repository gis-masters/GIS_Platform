import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { action, observable } from 'mobx';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { AddBoxOutlined } from '@material-ui/icons';

import { Loading } from '../Loading/Loading';
import { services } from '../../services/services';
import { EditedField } from '../../services/crg/schema.models';
import { EditFeatureInfo } from '../EditFeatureField/EditFeatureField';
import { transformFeature } from '../../services/geoserver/transform-feature.service';
import { CrgDocument, docLibraryService } from '../../services/crg/doc-library.service';

import { DocumentsListItem } from './Item/DocumentsList-Item';

import '!style-loader!css-loader!sass-loader!./DocumentsList.scss';
import '!style-loader!css-loader!sass-loader!./List/DocumentList-List.scss';
import '!style-loader!css-loader!sass-loader!./Input/DocumentList-Input.scss';
import '!style-loader!css-loader!sass-loader!./Label/DocumentList-Label.scss';
import '!style-loader!css-loader!sass-loader!./Empty/DocumentList-Empty.scss';
import '!style-loader!css-loader!sass-loader!./AddIcon/DocumentList-AddIcon.scss';

const cnDocumentsList = cn('DocumentsList');

export interface DocumentListItemData {
  id: string;
  title: string;
}

interface DocumentsListProps {
  documents?: DocumentListItemData[];
  editedField: EditedField;
  featureInfo: EditFeatureInfo;
  modifyCallback: (payload: DocumentListItemData[]) => void;
}

@observer
export class DocumentsList extends Component<DocumentsListProps> {
  @observable private loading = false;

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
          onChange={this.onFileChangeHandler}
        />
        {featureInfo.isReadOnly ? (
          <label className={cnDocumentsList('Label')} htmlFor={htmlId}>
            Добавить файл
            <AddBoxOutlined className={cnDocumentsList('AddIcon')} color='primary' fontSize='small' />
          </label>
        ) : null}

        <div className={cnDocumentsList('List', ['scroll'])}>
          {documents &&
            documents.map(document => (
              <DocumentsListItem
                document={document}
                editedField={editedField}
                featureInfo={featureInfo}
                deleteCallback={this.handleDeletion}
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
  setLoading(isLoading: boolean) {
    this.loading = isLoading;
  }

  @boundMethod
  private async handleDeletion(id: string) {
    if (this.props.documents) {
      const newDocumentList = this.props.documents.filter(doc => doc.id !== id);

      const { featureInfo, editedField } = this.props;
      await transformFeature.updateProperty(
        featureInfo.layerName,
        featureInfo.feature.id,
        editedField.name,
        JSON.stringify(newDocumentList)
      );
      this.props.modifyCallback(newDocumentList);
    }
  }

  @boundMethod
  private async onFileChangeHandler(e) {
    e.preventDefault();
    if (this.loading) {
      return;
    }

    try {
      const selectedFile = e.target.files[0];
      if (!selectedFile) {
        return;
      }

      this.setLoading(true);
      const { editedField } = this.props;
      const fileName = selectedFile.name;

      const crgDocument = await docLibraryService.createRecordWithBinary(
        selectedFile,
        fileName,
        editedField.property.resourcePath
      );

      // Update current feature
      const { featureInfo } = this.props;
      if (crgDocument) {
        const payload = this.preparePayload(crgDocument, fileName);

        await transformFeature.updateProperty(featureInfo.layerName, featureInfo.feature.id, editedField.name, payload);

        this.props.modifyCallback(JSON.parse(payload));
      }
    } catch (e) {
      services.logger.error('Something went wrong: ', e);
    } finally {
      this.setLoading(false);
    }
  }

  private preparePayload(loadedDocuments: CrgDocument[], title: string): string {
    const documents: DocumentListItemData[] = [
      ...(this.props.documents || []),
      ...loadedDocuments.map(({ id }) => ({ id, title }))
    ];

    return JSON.stringify(documents);
  }
}
