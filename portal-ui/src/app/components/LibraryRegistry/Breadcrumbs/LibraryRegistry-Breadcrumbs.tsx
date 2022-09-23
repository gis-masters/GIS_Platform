import React, { Component } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { HomeOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { isEqual } from 'lodash';

import {
  getIdsFromPath,
  getRegistryUrlWithFilter,
  getRegistryUrlWithPath
} from '../../DataManagement/DataManagement.utils';
import { FilterQuery } from '../../../services/util/filterObjects';
import { DocumentLibrary, getLibraryRecord, LibraryRecord } from '../../../services/data/doc-library.service';
import { BreadcrumbsItemData } from '../../Breadcrumbs/Item/Breadcrumbs-Item';
import { Breadcrumbs, BreadcrumbsProps } from '../../Breadcrumbs/Breadcrumbs';

import '!style-loader!css-loader!sass-loader!./LibraryRegistry-Breadcrumbs.scss';

const cnLibraryRegistryBreadcrumbs = cn('LibraryRegistry', 'Breadcrumbs');

interface LibraryRegistryBreadcrumbsProps {
  library: DocumentLibrary;
  path: number[];
  filter: FilterQuery;
  fromHome?: boolean;
  size?: BreadcrumbsProps['size'];
  onItemClick(path: number[]): void;
}

@observer
export class LibraryRegistryBreadcrumbs extends Component<LibraryRegistryBreadcrumbsProps> {
  private operationId: symbol;
  @observable private records?: LibraryRecord[] = [];

  constructor(props: LibraryRegistryBreadcrumbsProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    await this.fetchRecords();
  }

  async componentDidUpdate(prevProps: LibraryRegistryBreadcrumbsProps) {
    if (!isEqual(prevProps.path, this.props.path)) {
      await this.fetchRecords();
    }
  }

  render() {
    const { size = 'medium' } = this.props;

    return (
      <Breadcrumbs className={cnLibraryRegistryBreadcrumbs({ size })} items={this.items} itemsType='link' size={size} />
    );
  }

  @computed
  private get items(): BreadcrumbsItemData[] {
    const { filter, library, fromHome, onItemClick } = this.props;
    const items: BreadcrumbsItemData[] = [];

    if (fromHome) {
      const libraryRootUrlItems = ['r', 'root', 'lr', 'libraryRoot'];
      const libraryRootPath = JSON.stringify([...libraryRootUrlItems, 'empty', 'empty']);

      items.push(
        { title: <HomeOutlined />, url: '/data-management' },
        {
          title: 'Библиотеки документов',
          url: `/data-management?path_dm=${libraryRootPath}`
        }
      );
    }

    if (library) {
      const filterWithoutPath = { ...filter };
      delete filterWithoutPath.path;
      items.push(
        {
          title: library.title,
          url: getRegistryUrlWithFilter(library.identifier, filterWithoutPath),
          onClick: onItemClick,
          payload: []
        },
        ...this.records.map(({ title, path, id }) => {
          const pathIds = [...getIdsFromPath(path), id];

          return {
            title,
            url: getRegistryUrlWithPath(library.identifier, pathIds, filterWithoutPath),
            onClick: onItemClick,
            payload: pathIds
          };
        })
      );
    }

    return items;
  }

  private async fetchRecords() {
    const { path, library } = this.props;
    const operationId = Symbol();
    this.operationId = operationId;

    const records: LibraryRecord[] = [];

    for (const id of path) {
      records.push(await getLibraryRecord(library.identifier, id));
    }

    if (this.operationId === operationId) {
      this.setRecords(records);
    }
  }

  @action
  private setRecords(records: LibraryRecord[]) {
    this.records = records;
  }
}
