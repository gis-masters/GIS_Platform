import React, { Component } from 'react';
import { action, observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { ListItemIcon, MenuItem } from '@mui/material';
import { InsertDriveFile, NoteAddOutlined } from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { createLibraryRecord, getLibrary, getLibraryRecord } from '../../../services/data/library/library.service';
import { DataChangeEventDetail, communicationService } from '../../../services/communication.service';
import { ExplorerItemData, ExplorerItemType, emptyItem } from '../../Explorer/Explorer.models';
import { LibraryDocumentDialog } from '../../LibraryDocumentDialog/LibraryDocumentDialog';
import { Library, LibraryRecord } from '../../../services/data/library/library.models';
import { SelectFolderDialog } from '../../SelectFolderDialog/SelectFolderDialog';
import { applyContentType } from '../../../services/data/schema/schema.utils';
import { schemaService } from '../../../services/data/schema/schema.service';
import { ActionsItemVariant } from '../../Actions/Item/Actions-Item.base';
import { ActionsItem } from '../../Actions/Item/Actions-Item.composed';
import { Schema } from '../../../services/data/schema/schema.models';
import { getDefaultValues } from '../../Form/Form.utils';
import { FormDialog } from '../../FormDialog/FormDialog';
import { sleep } from '../../../services/util/sleep';

const cnLibraryDocumentActionsCreateChild = cn('LibraryDocumentActions', 'CreateChild');
const cnLibraryDocumentActionsCreateChildEditDialog = cn('LibraryDocumentActions', 'CreateChildEditDialog');

interface ChildData {
  document: LibraryRecord;
  schema: Schema;
  library: Library;
  contentType: string;
  onClick?(): void;
}

interface LibraryDocumentActionsCreateChildProps {
  document: LibraryRecord;
  as: ActionsItemVariant;
  schema?: Schema;
}

@observer
export class LibraryDocumentActionsCreateChild extends Component<LibraryDocumentActionsCreateChildProps> {
  @observable private childrenData: ChildData[] = [];
  @observable private currentChild?: ChildData;
  @observable private folder: LibraryRecord | null = null;
  @observable private dialogOpen = false;
  @observable private folderSelectionDialogOpen = false;
  private operationId?: symbol;
  @observable private createdDocument?: LibraryRecord;
  @observable private createdDocumentDialogOpen = false;

  constructor(props: LibraryDocumentActionsCreateChildProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    await this.init();

    communicationService.libraryRecordUpdated.on(async (e: CustomEvent<DataChangeEventDetail<LibraryRecord>>) => {
      const { data, type } = e.detail;
      const { libraryTableName, id } = data;

      if (this.createdDocument?.id !== id || libraryTableName !== this.createdDocument.libraryTableName) {
        return;
      }

      if (type === 'delete') {
        this.closeCreatedDocumentDialog();

        return;
      }

      if (type === 'update') {
        this.setCreatedDocument(await getLibraryRecord(libraryTableName, id));
      }
    }, this);
  }

  async componentDidUpdate(prevProps: LibraryDocumentActionsCreateChildProps) {
    if (this.props.document.id !== prevProps.document.id) {
      await this.init();
    }
  }

  componentWillUnmount() {
    communicationService.libraryRecordUpdated.scopeOff(this);
  }

  render() {
    const { as, document } = this.props;
    const properties = this.currentChild?.schema.properties || [];

    return (
      <>
        <ActionsItem
          className={cnLibraryDocumentActionsCreateChild()}
          title='Создать из документа...'
          as={as}
          icon={<NoteAddOutlined />}
          submenu={this.childrenData.map((child, i) => (
            <MenuItem key={i} onClick={child.onClick}>
              <ListItemIcon>
                <InsertDriveFile />
              </ListItemIcon>
              {child.schema.title}
            </MenuItem>
          ))}
        />

        <SelectFolderDialog
          title='Выберите папку для создания дочернего документа'
          subtitle='(создание возможно только в библиотеки и в папки с доступом на редактирование)'
          startPath={[{ type: ExplorerItemType.LIBRARY_ROOT, payload: null }, emptyItem]}
          open={this.folderSelectionDialogOpen}
          onClose={this.closeFolderSelectionDialog}
          customTestForDisabled={this.customTestForDisabled}
          onSelect={this.selectFolder}
        />

        {this.currentChild && this.folder && (
          <FormDialog
            className={cnLibraryDocumentActionsCreateChildEditDialog()}
            open={this.dialogOpen}
            onClose={this.formDialogCloseHandler}
            schema={this.currentChild.schema}
            value={{
              content_type_id: this.currentChild?.contentType,
              ...getDefaultValues(properties, document)
            }}
            actionFunction={this.createDocument}
          />
        )}

        {this.createdDocument && (
          <LibraryDocumentDialog
            document={this.createdDocument}
            open={this.createdDocumentDialogOpen}
            onClose={this.handleCreatedDocumentDialogClose}
          />
        )}
      </>
    );
  }

  @action
  private setChildrenData(data: ChildData[]) {
    this.childrenData = data;
  }

  @action.bound
  private selectFolder(folder: LibraryRecord | null) {
    this.folder = folder;
    this.closeFolderSelectionDialog();
  }

  @boundMethod
  private customTestForDisabled(item: ExplorerItemData<LibraryRecord>) {
    if (item.type === ExplorerItemType.LIBRARY && this.childrenData) {
      return !this.childrenData.some(child => child.library.id === item.payload.id);
    }
  }

  private async init() {
    const { schema, document } = this.props;
    const operationId = Symbol();
    this.operationId = operationId;
    const childrenData: ChildData[] = [];

    for (const { library: libraryTableName = document.libraryTableName, contentType } of schema?.children || []) {
      const library = await getLibrary(libraryTableName);
      const schema = applyContentType(await schemaService.getSchema(library.schemaId), contentType);

      childrenData.push({
        document,
        library,
        schema,
        contentType,
        onClick: this.handleChildClick.bind(this, library, schema, contentType)
      });
    }

    if (this.operationId === operationId) {
      this.setChildrenData(childrenData);
    }
  }

  @boundMethod
  private async formDialogCloseHandler() {
    this.closeFormDialog();
    await sleep(300);
    this.setCurrentChild();
  }

  @action
  private openFormDialog() {
    this.dialogOpen = true;
  }

  @action
  private closeFormDialog() {
    this.dialogOpen = false;
  }

  @action
  private openFolderSelectionDialog() {
    this.folderSelectionDialogOpen = true;
  }

  @action.bound
  private closeFolderSelectionDialog() {
    this.folderSelectionDialogOpen = false;
    if (this.folder) {
      this.openFormDialog();
    }
  }

  @action
  private setCurrentChild(child?: ChildData) {
    this.currentChild = child;
  }

  @action
  private setCreatedDocument(document?: LibraryRecord) {
    this.createdDocument = document;
  }

  @action
  private openCreatedDocumentDialog() {
    this.createdDocumentDialogOpen = true;
  }

  @action
  private closeCreatedDocumentDialog() {
    this.createdDocumentDialogOpen = false;
  }

  @boundMethod
  private async handleCreatedDocumentDialogClose() {
    this.closeCreatedDocumentDialog();
    await sleep(300);
    this.setCreatedDocument();
    this.selectFolder(null);
  }

  private handleChildClick(library: Library, schema: Schema, contentType: string) {
    const { document } = this.props;
    this.setCurrentChild({ document, library, schema, contentType });
    this.openFolderSelectionDialog();
  }

  @boundMethod
  private async createDocument(value: LibraryRecord) {
    if (!this.currentChild) {
      throw new Error('Current child is not defined');
    }
    const { library, schema } = this.currentChild;
    if (this.folder) {
      value.path = `${this.folder.path}/${this.folder.id}`;
    }

    this.setCreatedDocument(await createLibraryRecord(value, library.table_name, schema.name));
    this.openCreatedDocumentDialog();
  }
}
