import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { LibraryDeletedDocumentsSwitch } from '../LibraryDeletedDocumentsSwitch/LibraryDeletedDocumentsSwitch';
import { DocumentLibrary, LibraryRecord } from '../../services/data/docLibrary/docLibrary.models';
import { ExplorerItemData, ExplorerItemType } from '../Explorer/Explorer.models';
import { LibraryViewSwitch } from '../LibraryViewSwitch/LibraryViewSwitch';
import { Explorer } from '../Explorer/Explorer';

import '!style-loader!css-loader!sass-loader!./DataManagement.scss';

const cnDataManagement = cn('DataManagement');

@observer
export class DataManagement extends Component {
  @observable private library?: DocumentLibrary;
  @observable private path: number[] = [];

  constructor(props: object) {
    super(props);
    makeObservable(this);
  }

  render() {
    return (
      <div className={cnDataManagement()}>
        <Explorer
          preset={ExplorerItemType.ROOT}
          urlChangeEnabled
          withInfoPanel
          fixedHeight
          explorerRole='dm'
          libraryViewSwitch={
            this.library && <LibraryViewSwitch to='registry' library={this.library} path={this.path} />
          }
          deletedDocumentsSwitch={
            this.library && <LibraryDeletedDocumentsSwitch library={this.library} path={this.path} />
          }
          onOpen={this.handleOpenItem}
        />
      </div>
    );
  }

  @action.bound
  private handleOpenItem(item: ExplorerItemData, path: ExplorerItemData[]) {
    if (item.type === ExplorerItemType.LIBRARY) {
      this.library = item.payload as DocumentLibrary;
      this.path = [];
    } else if (item.type === ExplorerItemType.FOLDER) {
      this.library = path.find(({ type }) => type === ExplorerItemType.LIBRARY).payload as DocumentLibrary;
      this.path = path
        .filter(({ type }) => type === ExplorerItemType.FOLDER)
        .map(({ payload }) => (payload as LibraryRecord).id);
    } else {
      this.library = undefined;
      this.path = [];
    }
  }
}
