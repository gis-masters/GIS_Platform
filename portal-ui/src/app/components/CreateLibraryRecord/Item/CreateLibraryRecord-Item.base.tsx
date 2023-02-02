import React, { Component, ComponentType } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { ListItemIcon, MenuItem } from '@mui/material';
import {
  CreateNewFolderOutlined,
  FolderOutlined,
  InsertDriveFileOutlined,
  NoteAddOutlined,
  SvgIconComponent
} from '@mui/icons-material';
import { IClassNameProps } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { getDefaultValues } from '../../Form/Form.utils';
import { applyContentType } from '../../../services/data/schema.utils';
import { ContentType, Schema } from '../../../services/data/schema.models';
import { cleanCalculatedValues } from '../../../services/formValidation.service';
import { createLibraryRecord, DocumentLibrary, LibraryRecord } from '../../../services/data/doc-library.service';
import { FormDialog } from '../../FormDialog/FormDialog';
import { DocHome } from '../../Icons/DocHome';

import { CreateLibraryRecordItemSingleButtonProps } from '../ItemSingleButton/CreateLibraryRecord-ItemSingleButton';

export const cnCreateLibraryRecordItem = cn('CreateLibraryRecord', 'Item');

export interface CreateLibraryRecordItemProps extends IClassNameProps {
  contentType: ContentType;
  schema: Schema;
  library: DocumentLibrary;
  parent?: LibraryRecord;
  ButtonComponent?: ComponentType<CreateLibraryRecordItemSingleButtonProps>;
  single?: boolean;
  onCreate(record: LibraryRecord, isFolder: boolean): void;
}

const icons: Record<string, SvgIconComponent> = {
  FOLDER: FolderOutlined,
  FOLDER_CREATE: CreateNewFolderOutlined,
  DOCUMENT: InsertDriveFileOutlined,
  DOCUMENT_CREATE: NoteAddOutlined,
  GPZU: DocHome
};

@observer
export class CreateLibraryRecordItemBase extends Component<CreateLibraryRecordItemProps> {
  @observable private dialogOpen = false;
  @observable private loading = false;

  constructor(props: CreateLibraryRecordItemProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { contentType, parent, className, ButtonComponent } = this.props;
    const Icon: SvgIconComponent =
      icons[contentType.icon] || (contentType.type === 'FOLDER' ? icons.FOLDER : icons.DOCUMENT);
    const title = contentType.title || (contentType.type === 'FOLDER' ? 'Раздел' : 'Документ');

    return (
      <>
        {ButtonComponent ? (
          <ButtonComponent
            onClick={this.openDialog}
            className={cnCreateLibraryRecordItem(null, [className])}
            icon={contentType.type === 'FOLDER' ? <icons.FOLDER_CREATE /> : <icons.DOCUMENT_CREATE />}
            title={title}
          />
        ) : (
          <MenuItem onClick={this.openDialog} className={cnCreateLibraryRecordItem(null, [className])}>
            <ListItemIcon>
              <Icon />
            </ListItemIcon>
            {title}
          </MenuItem>
        )}

        <FormDialog
          title='Создание нового элемента'
          actionFunction={this.create}
          onClose={this.closeDialog}
          open={this.dialogOpen}
          schema={this.preparedSchema}
          actionButtonProps={{ children: 'Создать', loading: this.loading }}
          value={getDefaultValues(this.preparedSchema.properties, parent)}
        />
      </>
    );
  }

  @computed
  private get preparedSchema(): Schema {
    const { contentType, schema } = this.props;

    return applyContentType(schema, contentType.id);
  }

  @boundMethod
  private async create(formValue: LibraryRecord) {
    const { library, schema, contentType, onCreate } = this.props;

    const newRecord = this.fillSystemAttributes(
      cleanCalculatedValues<LibraryRecord>(formValue, this.preparedSchema.properties)
    );

    this.setLoading(true);

    try {
      const createdRecord = await createLibraryRecord(newRecord, library.table_name, schema.name);
      onCreate(createdRecord, contentType.type === 'FOLDER');
      this.closeDialog();
    } catch {}

    this.setLoading(false);
  }

  private fillSystemAttributes(formData: LibraryRecord) {
    const { contentType, parent } = this.props;

    return {
      ...formData,
      content_type_id: contentType.id,
      path: parent?.path ? `${parent.path}/${parent.id}` : '/root'
    };
  }

  @action.bound
  private openDialog() {
    this.dialogOpen = true;
  }

  @action.bound
  private closeDialog() {
    this.dialogOpen = false;
  }

  @action
  private setLoading(loading: boolean) {
    this.loading = loading;
  }
}
