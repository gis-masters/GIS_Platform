import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { FileOpenOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { LibraryRecord } from '../../../services/data/library/library.models';
import { SearchItemData, SearchItemDataTypeFeature } from '../../../services/data/search/search.model';
import { VectorTable } from '../../../services/data/vectorData/vectorData.models';
import { getVectorTable } from '../../../services/data/vectorData/vectorData.service';
import { ActionsItemVariant } from '../../Actions/Item/Actions-Item.base';
import { ActionsItem } from '../../Actions/Item/Actions-Item.composed';
import { LibraryDocumentDialog } from '../../LibraryDocumentDialog/LibraryDocumentDialog';
import { VectorTableFeatureDialog } from '../../VectorTableFeatureDialog/VectorTableFeatureDialog';

const cnLibrarySearchItemActionsOpen = cn('LibrarySearchItemActions', 'Open');

interface LibrarySearchItemActionsOpenProps {
  item: SearchItemData;
  libraryRecord: LibraryRecord | undefined;
  as: ActionsItemVariant;
}

@observer
export class LibrarySearchItemActionsOpen extends Component<LibrarySearchItemActionsOpenProps> {
  @observable private dialogOpen = false;
  @observable private table?: VectorTable;

  constructor(props: LibrarySearchItemActionsOpenProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount(): Promise<void> {
    if (this.props.item.type === 'FEATURE') {
      await this.getItemVectorTable();
    }
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

        {item?.type === 'FEATURE' && this.table && (
          <VectorTableFeatureDialog
            vectorTable={this.table}
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

  private async getItemVectorTable() {
    const { source } = this.props.item as SearchItemDataTypeFeature;
    const table = await getVectorTable(source.dataset, source.table);
    this.setVectorTable(table);
  }

  @action.bound
  private setVectorTable(table: VectorTable) {
    this.table = table;
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
