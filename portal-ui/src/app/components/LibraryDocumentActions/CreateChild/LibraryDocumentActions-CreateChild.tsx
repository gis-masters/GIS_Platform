import React, { Component } from 'react';
import { action, observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { ListItemIcon, MenuItem } from '@mui/material';
import { InsertDriveFile, NoteAddOutlined } from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import {
  createLibraryRecord,
  DocumentLibrary,
  getLibrary,
  LibraryRecord
} from '../../../services/data/doc-library.service';
import { sleep } from '../../../services/util/sleep';
import { getDefaultValues } from '../../Form/Form.utils';
import { Schema } from '../../../services/data/schema.models';
import { schemaService } from '../../../services/data/schema.service';
import { applyContentType } from '../../../services/data/schema.utils';
import { LibraryDocumentDialog } from '../../LibraryDocumentDialog/LibraryDocumentDialog';
import { FormDialog } from '../../FormDialog/FormDialog';

import { ActionsItem } from '../../Actions/Item/Actions-Item.composed';
import { ActionsItemVariant } from '../../Actions/Item/Actions-Item.base';

const cnLibraryDocumentActionsCreateChild = cn('LibraryDocumentActions', 'CreateChild');

interface ChildData {
  document: LibraryRecord;
  schema: Schema;
  library: DocumentLibrary;
  contentType: string;
  onClick?(): void;
}

interface LibraryDocumentActionsCreateChildProps {
  document: LibraryRecord;
  as: ActionsItemVariant;
  schema: Schema;
}

@observer
export class LibraryDocumentActionsCreateChild extends Component<LibraryDocumentActionsCreateChildProps> {
  @observable private childrenData: ChildData[] = [];
  @observable private currentChild?: ChildData;
  @observable private dialogOpen = false;
  private operationId: symbol;
  @observable private createdDocument?: LibraryRecord;
  @observable private createdDocumentDialogOpen = false;

  constructor(props: LibraryDocumentActionsCreateChildProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    await this.init();
  }

  async componentDidUpdate(prevProps: LibraryDocumentActionsCreateChildProps) {
    if (this.props.document.id !== prevProps.document.id) {
      await this.init();
    }
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

        <FormDialog
          open={this.dialogOpen}
          onClose={this.formDialogCloseHandler}
          schema={this.currentChild?.schema}
          value={{ content_type_id: this.currentChild?.contentType, ...getDefaultValues(properties, document) }}
          actionFunction={this.createDocument}
        />

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

  private async init() {
    const { schema, document } = this.props;
    const operationId = Symbol();
    this.operationId = operationId;
    const childrenData: ChildData[] = [];

    for (const { library: libraryId = document.libraryId, contentType } of schema.children) {
      const library = await getLibrary(libraryId);
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
  }

  private handleChildClick(library: DocumentLibrary, schema: Schema, contentType: string) {
    const { document } = this.props;
    this.setCurrentChild({ document, library, schema, contentType });
    this.openFormDialog();
  }

  @boundMethod
  private async createDocument(value: LibraryRecord) {
    const { library, schema } = this.currentChild;
    this.setCreatedDocument(await createLibraryRecord(value, library.identifier, schema.name));
    this.openCreatedDocumentDialog();
  }
}
