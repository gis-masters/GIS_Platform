import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { action, observable } from 'mobx';

import { LayerAdd } from '../../Icons/LayerAdd';
import { LayerAddOutlined } from '../../Icons/LayerAddOutlined';
import { PropertySchema } from '../../../services/crg/schema.models';
import { ActionsItemVariant } from '../Item/LibraryDocumentActions-Item';
import { LibraryRecord } from '../../../services/crg/doc-library.service';
import { FilesPlacementDialog } from '../../FilesPlacementDialog/FilesPlacementDialog';
import { LibraryDocumentActionsItem } from '../Item/LibraryDocumentActions-Item.composed';

const cnLibraryDocumentActionsFilesPlacement = cn('LibraryDocumentActions', 'FilesPlacement');

interface LibraryDocumentActionsFilesPlacementProps {
  document: LibraryRecord;
  properties: PropertySchema<LibraryRecord>[];
  as: ActionsItemVariant;
}

@observer
export class LibraryDocumentActionsFilesPlacement extends Component<LibraryDocumentActionsFilesPlacementProps> {
  @observable private dialogOpen = false;

  render() {
    const { as, document, properties } = this.props;

    return (
      <>
        <LibraryDocumentActionsItem
          className={cnLibraryDocumentActionsFilesPlacement()}
          title='Разместить в проекте'
          icon={this.dialogOpen ? <LayerAdd /> : <LayerAddOutlined />}
          onClick={this.openDialog}
          as={as}
        />

        <FilesPlacementDialog
          document={document}
          properties={properties}
          open={this.dialogOpen}
          onClose={this.closeDialog}
        />
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
