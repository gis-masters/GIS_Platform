import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { action, computed, observable } from 'mobx';
import { NoteAddOutlined } from '@material-ui/icons';
import { boundMethod } from 'autobind-decorator';

import { Toast } from '../Toast/Toast';
import { services } from '../../services/services';
import { MenuIconButton } from '../MenuIconButton/MenuIconButton';
import { schemaService } from '../../services/crg/schema.service';
import { communicationService } from '../../services/communication.service';
import { getSchemaWithAppliedContentType } from '../../services/crg/schema.utils';
import { ContentType, FeatureDescription } from '../../services/crg/schema.models';
import { docLibraryService, LibraryRecord } from '../../services/crg/doc-library.service';
import { ExplorerItemType } from '../Explorer/Explorer.models';
import { ExplorerStore } from '../Explorer/Explorer.store';

import { CreateLibraryElementDialog } from './Dialog/CreateLibraryElement-Dialog';
import { CreateLibraryElementMenuItem } from './MenuItem/CreateLibraryElement-MenuItem';
import { CreateLibraryElementFolderButton } from './FolderButton/CreateLibraryElement-FolderButton';

export interface CreateLibraryElementsProps {
  schemaId: string;
  store: ExplorerStore;
  path?: string;
}

@observer
export class CreateLibraryElement extends Component<CreateLibraryElementsProps> {
  @observable private schema: FeatureDescription;
  @observable private contentTypeId: string;
  @observable private dialogOpen = false;
  @observable private dialogLoading = false;

  async componentDidMount() {
    const schema = await schemaService.getSchema(this.props.schemaId);
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
  private async create(formValue: LibraryRecord) {
    this.setDialogLoading(true);

    const formData = this.fillSystemAttributes(formValue);
    for (const propName in formData) {
      // Удаляем пустые строки и нули? Наркомания...
      if (!formData[propName]) {
        delete formData[propName];
      }
    }

    try {
      await docLibraryService.createRecord(this.schema.tableName, formData);

      communicationService.libraryItemsUpdated.emit();
    } catch (error) {
      Toast.error('Ошибка сохранения записи');
      services.logger.error('Ошибка сохранения записи: ', error);
    }

    this.closeDialog();
  }

  private fillSystemAttributes(formData: LibraryRecord) {
    return {
      ...formData,
      content_type_id: this.contentTypeId,
      path: this.props.path,
      oktmo: formData.oktmo ? formData.oktmo : this.inheritOktmo()
    };
  }

  private inheritOktmo(): string {
    const { path } = this.props.store;
    const pathElement = path[path.length - 2];
    if (pathElement && pathElement.type === ExplorerItemType.FOLDER) {
      // FIXME
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return pathElement.payload.oktmo; // eslint-disable-line @typescript-eslint/no-unsafe-return
    }

    return '';
  }
}
