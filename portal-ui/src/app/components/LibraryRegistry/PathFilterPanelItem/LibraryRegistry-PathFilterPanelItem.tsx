import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { Library, LibraryRecord } from '../../../services/data/library/library.models';
import { getLibraryRecord } from '../../../services/data/library/library.service';
import { XTableFilterPanelItemContentProps } from '../../XTable/FilterPanelItemContent/XTable-FilterPanelItemContent.base';
import { getBreadcrumbsPathFromFilter } from '../LibraryRegistry.util';

const cnLibraryRegistryPathFilterPanelItem = cn('LibraryRegistry', 'PathFilterPanelItem');

interface LibraryRegistryPathFilterPanelItemProps extends XTableFilterPanelItemContentProps<LibraryRecord> {
  library?: Library;
}

@observer
export class LibraryRegistryPathFilterPanelItem extends Component<LibraryRegistryPathFilterPanelItemProps> {
  @observable private parentFolder?: LibraryRecord;
  private operationId?: symbol;

  constructor(props: XTableFilterPanelItemContentProps<LibraryRecord>) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    await this.loadParentFolder();
  }

  async componentDidUpdate(prevProps: LibraryRegistryPathFilterPanelItemProps) {
    const prevParentFolderId = getBreadcrumbsPathFromFilter(prevProps.filter).at(-1);
    if (prevParentFolderId !== this.breadcrumbsPath.at(-1)) {
      await this.loadParentFolder();
    }
  }

  render() {
    if (!this.parentFolder) {
      return null;
    }

    return <span className={cnLibraryRegistryPathFilterPanelItem()}>{this.parentFolder?.title}</span>;
  }

  private get breadcrumbsPath(): number[] {
    return getBreadcrumbsPathFromFilter(this.props.filter);
  }

  private async loadParentFolder() {
    const { library } = this.props;
    const lastCrumb = this.breadcrumbsPath.at(-1);

    if (!library || !lastCrumb) {
      return;
    }

    const operationId = Symbol();
    this.operationId = operationId;

    const parentFolder = await getLibraryRecord(library.table_name, lastCrumb);

    if (this.operationId === operationId) {
      this.setParentFolder(parentFolder);
    }
  }

  @action
  private setParentFolder(parentFolder: LibraryRecord) {
    this.parentFolder = parentFolder;
  }
}
