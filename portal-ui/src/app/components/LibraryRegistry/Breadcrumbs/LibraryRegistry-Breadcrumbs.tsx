import React, { Component, ReactNode } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { FolderOutlined, HomeOutlined, LocalLibraryOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';
import { isEqual } from 'lodash';

import { Library, LibraryRecord } from '../../../services/data/library/library.models';
import { getLibraryRecord } from '../../../services/data/library/library.service';
import { FilterQuery } from '../../../services/util/filters/filters.models';
import { Breadcrumbs, BreadcrumbsItemData, BreadcrumbsProps } from '../../Breadcrumbs/Breadcrumbs';
import {
  getIdsFromPath,
  getRegistryUrlWithFilter,
  getRegistryUrlWithPath
} from '../../DataManagement/DataManagement.utils';
import { Library as LibraryIcon } from '../../Icons/Library';

import '!style-loader!css-loader!sass-loader!./LibraryRegistry-Breadcrumbs.scss';
import '!style-loader!css-loader!sass-loader!../BreadcrumbsIcon/LibraryRegistry-BreadcrumbsIcon.scss';

const cnLibraryRegistryBreadcrumbs = cn('LibraryRegistry', 'Breadcrumbs');
const cnLibraryRegistryBreadcrumbsIcon = cn('LibraryRegistry', 'BreadcrumbsIcon');

interface LibraryRegistryBreadcrumbsProps extends IClassNameProps {
  library: Library;
  path: number[];
  filter: FilterQuery;
  fromHome?: boolean;
  additionalItem?: ReactNode;
  size?: BreadcrumbsProps['size'];
  onItemClick(path: unknown): void;
  menuButtonOnly?: boolean;
}

@observer
export class LibraryRegistryBreadcrumbs extends Component<LibraryRegistryBreadcrumbsProps> {
  private operationId?: symbol;
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
    const { size = 'medium', menuButtonOnly, className } = this.props;

    return (
      <Breadcrumbs
        className={cnLibraryRegistryBreadcrumbs({ size, menuButtonOnly }, [className])}
        items={this.items}
        itemsType='link'
        size={size}
        menuButtonOnly={menuButtonOnly}
      />
    );
  }

  @computed
  private get items(): BreadcrumbsItemData[] {
    const { filter, library, fromHome, additionalItem, onItemClick } = this.props;
    const items: BreadcrumbsItemData[] = [];

    if (fromHome) {
      const libraryRootUrlItems = ['r', 'root', 'lr', 'libraryRoot'];
      const libraryRootPath = JSON.stringify([...libraryRootUrlItems, 'none', 'none']);

      items.push(
        { title: <HomeOutlined />, url: '/data-management' },
        {
          title: (
            <>
              <LibraryIcon color='primary' fontSize='small' className={cnLibraryRegistryBreadcrumbsIcon()} />
              Библиотеки документов
            </>
          ),
          url: `/data-management?path_dm=${libraryRootPath}`
        }
      );
    }

    if (library) {
      const filterWithoutPath = { ...filter };
      delete filterWithoutPath.path;

      items.push(
        {
          title: (
            <>
              <LocalLibraryOutlined color='primary' fontSize='small' className={cnLibraryRegistryBreadcrumbsIcon()} />
              {library.title}
            </>
          ),
          url: getRegistryUrlWithFilter(library.table_name, filterWithoutPath),
          onClick: onItemClick,
          payload: []
        },
        ...(this.records || []).map(({ title, path, id }) => {
          const pathIds = [...getIdsFromPath(path), id];

          return {
            title: (
              <>
                <FolderOutlined color='primary' fontSize='small' className={cnLibraryRegistryBreadcrumbsIcon()} />
                {title}
              </>
            ),
            url: getRegistryUrlWithPath(library.table_name, pathIds, filterWithoutPath),
            onClick: onItemClick,
            payload: pathIds
          };
        })
      );
    }

    if (additionalItem) {
      items.push({
        title: additionalItem,
        itemType: 'none'
      });
    }

    return items;
  }

  private async fetchRecords() {
    const { path, library } = this.props;
    const operationId = Symbol();
    this.operationId = operationId;

    const records: LibraryRecord[] = [];

    for (const id of path) {
      records.push(await getLibraryRecord(library.table_name, id));
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
