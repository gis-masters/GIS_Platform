import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { action, computed, observable, makeObservable } from 'mobx';
import { CreateNewFolderOutlined, NoteAddOutlined } from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';
import { AxiosError } from 'axios';

import { ExplorerStore } from '../Explorer/Explorer.store';
import { createLibraryRecord, LibraryRecord, LibraryRecordRaw } from '../../services/data/doc-library.service';
import { applyContentType } from '../../services/data/schema.utils';
import { ContentType, PropertyType, Schema } from '../../services/data/schema.models';
import { schemaService } from '../../services/data/schema.service';
import { ExplorerItemType } from '../Explorer/Explorer.models';
import {
  cleanCalculatedValues,
  FieldErrors,
  getDefaultValues,
  normalizeServerErrors,
  validateFormValue
} from '../../services/formValidation.service';
import { MenuIconButton } from '../MenuIconButton/MenuIconButton';

import { CreateLibraryElementDialog } from './Dialog/CreateLibraryElement-Dialog';
import { CreateLibraryElementMenuItem } from './MenuItem/CreateLibraryElement-MenuItem';
import { CreateLibraryElementFolderButton } from './FolderButton/CreateLibraryElement-FolderButton';

export interface CreateLibraryElementsProps {
  libraryIdentifier: string;
  schemaId: string;
  store: ExplorerStore;
  path?: string;
}

@observer
export class CreateLibraryElement extends Component<CreateLibraryElementsProps> {
  @observable private schema: Schema;
  @observable private contentTypeId: string;
  @observable private dialogOpen = false;
  @observable private dialogLoading = false;
  @observable private formErrors?: FieldErrors[];
  @observable private serverFormErrors?: FieldErrors[];
  @observable private formValue: LibraryRecordRaw = {};

  constructor(props: CreateLibraryElementsProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    const schema = await schemaService.getSchema(this.props.schemaId);
    this.setSchema(schema);
  }

  render() {
    return (
      <>
        <MenuIconButton icon={<NoteAddOutlined />}>
          {this.contentTypesWithoutFolder.map((contentType, i) => (
            <CreateLibraryElementMenuItem contentType={contentType} onClick={this.itemClickHandler} key={i} />
          ))}
        </MenuIconButton>

        {this.folderContentTypes?.length === 1 && (
          <CreateLibraryElementFolderButton
            onClick={this.itemClickHandler}
            contentTypeId={this.folderContentTypes[0].id}
          />
        )}

        {this.folderContentTypes?.length > 1 && (
          <MenuIconButton icon={<CreateNewFolderOutlined />}>
            {this.folderContentTypes.map((contentType, i) => (
              <CreateLibraryElementMenuItem contentType={contentType} onClick={this.itemClickHandler} key={i} />
            ))}
          </MenuIconButton>
        )}

        <CreateLibraryElementDialog
          open={this.dialogOpen}
          formValue={this.formValue}
          loading={this.dialogLoading}
          schema={this.preparedSchema}
          onClose={this.closeDialog}
          onCreate={this.create}
          onChange={this.setFormValue}
          formErrors={[...(this.serverFormErrors || []), ...(this.formErrors || [])]}
          onFieldChange={this.formFieldChanged}
          onFieldNeedValidate={this.formFieldValidateHandler}
        />
      </>
    );
  }

  @computed
  private get contentTypesWithoutFolder(): ContentType[] {
    const contentTypes = this.schema?.contentTypes || [];

    return contentTypes.filter(({ type, childOnly }) => type !== 'FOLDER' && !childOnly);
  }

  @computed
  private get folderContentTypes(): ContentType[] {
    const contentTypes = this.schema?.contentTypes || [];

    return contentTypes.filter(({ type, childOnly }) => type === 'FOLDER' && !childOnly);
  }

  @computed
  private get preparedSchema(): Schema | null {
    if (!this.schema) {
      return null;
    }

    return applyContentType(this.schema, this.contentTypeId);
  }

  @computed
  private get isEditingElementFolder(): boolean | null {
    if (!this.schema) {
      return null;
    }

    return this.contentTypeId && !!this.folderContentTypes?.find(({ id }) => id === this.contentTypeId);
  }

  @boundMethod
  private itemClickHandler(contentTypeId: string) {
    this.setContentTypeId(contentTypeId);
    this.openDialog();
  }

  @action.bound
  private openDialog() {
    this.setFormValue(getDefaultValues(this.preparedSchema.properties));
    this.dialogOpen = true;
  }

  @action.bound
  private closeDialog() {
    this.dialogOpen = false;
    this.setDialogLoading(false);
    this.setErrors([]);
    this.setServerErrors([]);
  }

  @action
  private setSchema(schema: Schema) {
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
    const { libraryIdentifier, schemaId, store } = this.props;
    const formData = this.fillSystemAttributes(
      cleanCalculatedValues<LibraryRecord>(formValue, this.preparedSchema.properties)
    );

    this.setDialogLoading(true);

    for (const propName in formData) {
      // Удаляем пустые строки и нули? Наркомания...
      if (!formData[propName]) {
        delete formData[propName];
      }
    }

    this.setErrors(validateFormValue(formData, this.preparedSchema.properties));
    if (this.formErrors?.length) {
      this.setDialogLoading(false);

      return;
    }

    try {
      const record = await createLibraryRecord(formData, libraryIdentifier, schemaId);
      const explorerItem = {
        payload: record,
        type: this.isEditingElementFolder ? ExplorerItemType.FOLDER : ExplorerItemType.DOCUMENT
      };

      store.selectItem(explorerItem);

      this.closeDialog();
    } catch (error) {
      const err = error as AxiosError<{ errors?: FieldErrors[] }>;

      if (err?.response?.data?.errors) {
        this.setServerErrors(normalizeServerErrors(err.response.data.errors));
      }
    }

    this.setDialogLoading(false);
  }

  private fillSystemAttributes(formData: LibraryRecord) {
    return {
      ...formData,
      content_type_id: this.contentTypeId,
      path: this.props.path,
      oktmo: formData.oktmo || this.inheritOktmo()
    };
  }

  private inheritOktmo(): string {
    const { path } = this.props.store;
    const pathElement = path[path.length - 2];
    if (pathElement && pathElement.type === ExplorerItemType.FOLDER) {
      // FIXME // KILLME
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return pathElement.payload.oktmo; // eslint-disable-line @typescript-eslint/no-unsafe-return
    }

    return '';
  }

  @boundMethod
  private formFieldChanged(value: unknown, fieldName: string, prevValue: unknown) {
    const { propertyType } = this.preparedSchema.properties.find(({ name }) => name === fieldName);

    if (propertyType === PropertyType.BINARY) {
      if (
        value instanceof File &&
        (!this.formValue.title || (prevValue instanceof File && this.formValue.title === prevValue.name))
      ) {
        this.formValue.title = value.name;
      }
      if (!value && prevValue instanceof File && this.formValue.title === prevValue.name) {
        this.formValue.title = '';
      }
    }

    this.filterFieldErrors(fieldName);
  }

  @boundMethod
  private formFieldValidateHandler(value: unknown, fieldName: string) {
    this.filterFieldErrors(fieldName);
    this.setErrors(validateFormValue(this.formValue, this.preparedSchema.properties));
  }

  @action
  private setErrors(errors: FieldErrors[] = []) {
    this.formErrors = errors.filter(({ messages }) => messages?.length);
  }

  @action
  private setServerErrors(errors: FieldErrors[]) {
    this.serverFormErrors = errors;
  }

  @action.bound
  private setFormValue(formValue: LibraryRecordRaw) {
    this.formValue = formValue;
  }

  private filterFieldErrors(fieldName: string) {
    this.setErrors(this.formErrors?.filter(({ field }) => field !== fieldName));
    this.setServerErrors(this.serverFormErrors?.filter(({ field }) => field !== fieldName));
  }
}
