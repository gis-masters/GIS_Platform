import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { action, computed, observable } from 'mobx';
import { NoteAddOutlined } from '@material-ui/icons';
import { boundMethod } from 'autobind-decorator';

import { services } from '../../services/services';
import { schemaService } from '../../services/crg/schema.service';
import { getSchemaWithAppliedContentType } from '../../services/crg/schema.utils';
import { ContentType, FeatureDescription } from '../../services/crg/schema.models';
import { docLibraryService, DocumentLibrary, LibraryItem } from '../../services/crg/doc-library.service';
import { MenuIconButton } from '../MenuIconButton/MenuIconButton';

import { CreateLibraryElementDialog } from './Dialog/CreateLibraryElement-Dialog';
import { CreateLibraryElementMenuItem } from './MenuItem/CreateLibraryElement-MenuItem';
import { CreateLibraryElementFolderButton } from './FolderButton/CreateLibraryElement-FolderButton';

export interface CreateLibraryElementsProps {
  payload: DocumentLibrary | LibraryItem;
  parent?: string;
}

@observer
export class CreateLibraryElement extends Component<CreateLibraryElementsProps> {
  @observable private schema: FeatureDescription;
  @observable private contentTypeId: string;
  @observable private dialogOpen = false;
  @observable private dialogLoading = false;

  async componentDidMount() {
    const schema = await schemaService.getSchema(this.props.payload.schemaId);
    this.setSchema(schema);
  }

  render() {
    return (
      <>
        <MenuIconButton Icon={NoteAddOutlined}>
          {this.contentTypesWithoutFolder.map(contentType => (
            <CreateLibraryElementMenuItem
              contentType={contentType}
              onClick={this.itemClickHandler}
              key={contentType.id}
            />
          ))}
        </MenuIconButton>

        {this.folderContentType && (
          <CreateLibraryElementFolderButton onClick={this.itemClickHandler} contentTypeId={this.folderContentType.id} />
        )}

        <CreateLibraryElementDialog
          open={this.dialogOpen}
          loading={this.dialogLoading}
          schema={this.preparedSchema}
          onClose={this.closeDialog}
          onCreate={this.create}
        />
      </>
    );
  }

  @computed
  private get contentTypesWithoutFolder(): ContentType[] {
    const contentTypes = this.schema?.contentTypes || [];

    return contentTypes.filter(({ type }) => type !== 'FOLDER');
  }

  @computed
  private get folderContentType(): ContentType {
    const contentTypes = this.schema?.contentTypes || [];

    return contentTypes.find(({ type }) => type === 'FOLDER');
  }

  @computed
  private get preparedSchema(): FeatureDescription | null {
    if (!this.schema || !this.contentTypeId) {
      return null;
    }

    return getSchemaWithAppliedContentType(this.schema, this.contentTypeId);
  }

  @boundMethod
  private itemClickHandler(contentTypeId: string) {
    this.setContentTypeId(contentTypeId);
    this.openDialog();
  }

  @action.bound
  private openDialog() {
    this.dialogOpen = true;
  }

  @action.bound
  private closeDialog() {
    this.dialogOpen = false;
    this.setDialogLoading(false);
  }

  @action
  private setSchema(schema: FeatureDescription) {
    this.schema = schema;
  }

  @action
  private setContentTypeId(contentTypeId: string) {
    this.contentTypeId = contentTypeId;
  }

  @action
  private setDialogLoading(loading: boolean) {
    this.dialogLoading = loading;
  }

  @boundMethod
  private async create(formValue: LibraryItem) {
    this.setDialogLoading(true);
    const value = {
      ...formValue,
      content_type_id: this.contentTypeId,
      parent: this.props.parent
    };

    for (const propName in value) {
      // Удаляем пустые строки и нули? Наркомания...
      if (!value[propName]) {
        delete value[propName];
      }
    }

    try {
      const crgDocuments = await docLibraryService.createRecord(this.schema.tableName, value);
      if (crgDocuments) {
        // эксплорер из консоли не прочитает, на кой тут это?
        services.logger.info('Send event to refresh explorer');
      }
    } catch (e) {
      // Сёрнули в консоль и всё? А пользователю сообщить, чем его действие закончилось?
      services.logger.error('Error saving library item: ', e);
    } finally {
      this.closeDialog();
    }
  }
}
