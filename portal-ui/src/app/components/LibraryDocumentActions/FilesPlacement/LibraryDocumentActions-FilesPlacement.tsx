import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { LibraryRecord } from '../../../services/data/library/library.models';
import { Schema } from '../../../services/data/schema/schema.models';
import { ActionsItemVariant } from '../../Actions/Item/Actions-Item.base';
import { ActionsItem } from '../../Actions/Item/Actions-Item.composed';
import { FilesPlacementDialog } from '../../FilesPlacementDialog/FilesPlacementDialog';
import { LayerAdd } from '../../Icons/LayerAdd';
import { LayerAddOutlined } from '../../Icons/LayerAddOutlined';

const cnLibraryDocumentActionsFilesPlacement = cn('LibraryDocumentActions', 'FilesPlacement');

interface LibraryDocumentActionsFilesPlacementProps {
  document: LibraryRecord;
  schema?: Schema;
  as: ActionsItemVariant;
}

@observer
export class LibraryDocumentActionsFilesPlacement extends Component<LibraryDocumentActionsFilesPlacementProps> {
  @observable private dialogOpen = false;

  constructor(props: LibraryDocumentActionsFilesPlacementProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { as, document, schema } = this.props;

    return (
      <>
        <ActionsItem
          className={cnLibraryDocumentActionsFilesPlacement()}
          title='Разместить растровые файлы документа в проекте'
          icon={this.dialogOpen ? <LayerAdd /> : <LayerAddOutlined />}
          onClick={this.openDialog}
          as={as}
        />

        {schema && (
          <FilesPlacementDialog document={document} schema={schema} open={this.dialogOpen} onClose={this.closeDialog} />
        )}
      </>
    );
  }

  @action.bound
  private openDialog() {
    this.dialogOpen = true;
  }

  @action.bound
  private closeDialog() {
    this.dialogOpen = false;
  }
}
