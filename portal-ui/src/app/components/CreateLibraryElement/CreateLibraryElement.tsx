import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { action, computed, observable } from 'mobx';
import { NoteAddOutlined } from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';
import { AxiosError } from 'axios';

import { ExplorerStore } from '../Explorer/Explorer.store';
import { createLibraryRecord, LibraryRecord, LibraryRecordRaw } from '../../services/crg/doc-library.service';
import { convertSchema, getSchemaWithAppliedContentType } from '../../services/crg/schema.utils';
import { ContentType, OldFeatureDescription } from '../../services/crg/schemaOld.models';
import { PropertySchema } from '../../services/crg/schema.models';
import { schemaService } from '../../services/crg/schema.service';
import { ExplorerItemType } from '../Explorer/Explorer.models';
import {
  FieldErrors,
  getDefaultValues,
  normalizeServerErrors,
  validateFormValue
} from '../../services/crg/formValidation.service';
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
  @observable private schema: OldFeatureDescription;
  @observable private contentTypeId: string;
  @observable private dialogOpen = false;
  @observable private dialogLoading = false;
  @observable private formErrors?: FieldErrors[];
  @observable private serverFormErrors?: FieldErrors[];
  @observable private formValue: LibraryRecordRaw = {};

  async componentDidMount() {
    const schema = await schemaService.getSchema(this.props.schemaId);
    this.setSchema(schema);
    this.setFormValue(getDefaultValues(this.fields));
  }

  render() {
    return (
      <>
        <MenuIconButton Icon={NoteAddOutlined}>
          {this.contentTypesWithoutFolder.map((contentType, i) => (
            <CreateLibraryElementMenuItem contentType={contentType} onClick={this.itemClickHandler} key={i} />
          ))}
        </MenuIconButton>

        {this.folderContentType && (
          <CreateLibraryElementFolderButton onClick={this.itemClickHandler} contentTypeId={this.folderContentType.id} />
        )}

        <CreateLibraryElementDialog
          open={this.dialogOpen}
          formValue={this.formValue}
          loading={this.dialogLoading}
          fields={this.fields}
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

    return contentTypes.filter(({ type }) => type !== 'FOLDER');
  }

  @computed
  private get folderContentType(): ContentType | undefined {
    const contentTypes = this.schema?.contentTypes || [];

    return contentTypes.find(({ type }) => type === 'FOLDER');
  }

  @computed
  private get preparedSchema(): OldFeatureDescription | null {
    if (!this.schema) {
      return null;
    }

    return getSchemaWithAppliedContentType(this.schema, this.contentTypeId);
  }

  @computed
  private get isEditingElementFolder(): boolean | null {
    if (!this.schema) {
      return null;
    }

    return this.contentTypeId && this.folderContentType?.id === this.contentTypeId;
  }

  @computed
  private get fields(): PropertySchema[] {
    if (!this.preparedSchema) {
      return [];
    }

    return convertSchema(this.preparedSchema.properties);
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
    this.setErrors([]);
    this.setServerErrors([]);
    this.setFormValue(getDefaultValues(this.fields));
  }

  @action
  private setSchema(schema: OldFeatureDescription) {
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
    const formData = this.fillSystemAttributes(formValue);
    for (const propName in formData) {
      // Удаляем пустые строки и нули? Наркомания...
      if (!formData[propName]) {
        delete formData[propName];
      }
    }

    this.setErrors(validateFormValue(formData, this.fields));
    if (this.formErrors?.length) {
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
      // FIXME // KILLME
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return pathElement.payload.oktmo; // eslint-disable-line @typescript-eslint/no-unsafe-return
    }

    return '';
  }

  @boundMethod
  private formFieldChanged(value: unknown, fieldName: string) {
    if (value && value instanceof File && !this.formValue.title) {
      this.formValue.title = value.name.slice(0, Math.max(0, value.name.lastIndexOf('.')));
    }

    this.filterFieldErrors(fieldName);
  }

  @boundMethod
  private formFieldValidateHandler(value: unknown, fieldName: string) {
    this.filterFieldErrors(fieldName);
    this.setErrors(validateFormValue(this.formValue, this.fields));
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
