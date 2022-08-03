import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { action, observable, makeObservable } from 'mobx';

import { LayerAdd } from '../../Icons/LayerAdd';
import { LayerAddOutlined } from '../../Icons/LayerAddOutlined';
import { Schema } from '../../../services/data/schema.models';
import { ActionsItemVariant } from '../Item/LibraryDocumentActions-Item';
import { LibraryRecord } from '../../../services/data/doc-library.service';
import { FilesPlacementDialog } from '../../FilesPlacementDialog/FilesPlacementDialog';
import { LibraryDocumentActionsItem } from '../Item/LibraryDocumentActions-Item.composed';

const cnLibraryDocumentActionsFilesPlacement = cn('LibraryDocumentActions', 'FilesPlacement');

interface LibraryDocumentActionsFilesPlacementProps {
  document: LibraryRecord;
  schema: Schema<LibraryRecord>;
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
        <LibraryDocumentActionsItem
          className={cnLibraryDocumentActionsFilesPlacement()}
          title='Разместить в проекте'
          icon={this.dialogOpen ? <LayerAdd /> : <LayerAddOutlined />}
          onClick={this.openDialog}
          as={as}
        />

        <FilesPlacementDialog document={document} schema={schema} open={this.dialogOpen} onClose={this.closeDialog} />
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
