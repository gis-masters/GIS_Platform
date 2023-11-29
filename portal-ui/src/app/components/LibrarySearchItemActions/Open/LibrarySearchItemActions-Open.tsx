import React, { Component } from 'react';
import { action, observable, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { FileOpenOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { VectorTableFeatureDialog } from '../../VectorTableFeatureDialog/VectorTableFeatureDialog';
import { LibraryDocumentDialog } from '../../LibraryDocumentDialog/LibraryDocumentDialog';
import { LibraryRecord } from '../../../services/data/library/library.models';
import { SearchItemData } from '../../../services/data/search/search.model';
import { ActionsItemVariant } from '../../Actions/Item/Actions-Item.base';
import { ActionsItem } from '../../Actions/Item/Actions-Item.composed';

const cnLibrarySearchItemActionsOpen = cn('LibrarySearchItemActions', 'Open');

interface LibrarySearchItemActionsOpenProps {
  item: SearchItemData;
  libraryRecord: LibraryRecord | undefined;
  as: ActionsItemVariant;
}

@observer
export class LibrarySearchItemActionsOpen extends Component<LibrarySearchItemActionsOpenProps> {
  @observable private dialogOpen = false;

  constructor(props: LibrarySearchItemActionsOpenProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { as, item, libraryRecord } = this.props;

    return (
      <>
        <ActionsItem
          className={cnLibrarySearchItemActionsOpen()}
          title='Открыть'
          as={as}
          icon={<FileOpenOutlined />}
          onClick={this.openDialog}
        />

        {item?.type === 'FEATURE' && (
          <VectorTableFeatureDialog
            feature={item.payload}
            open={this.dialogOpen}
            source={item.source}
            onClose={this.closeDialog}
          />
        )}

        {item?.type === 'DOCUMENT' && libraryRecord && (
          <LibraryDocumentDialog document={libraryRecord} open={this.dialogOpen} onClose={this.closeDialog} />
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
