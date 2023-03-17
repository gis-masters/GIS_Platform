import React, { Component } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { FolderOutlined, HomeOutlined, LocalLibraryOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { isEqual } from 'lodash';

import {
  getIdsFromPath,
  getRegistryUrlWithPath,
  getRegistryUrlWithFilter
} from '../../DataManagement/DataManagement.utils';
import { FilterQuery } from '../../../services/util/filterObjects';
import { getLibraryRecord } from '../../../services/data/docLibrary/docLibrary.service';
import { DocumentLibrary, LibraryRecord } from '../../../services/data/docLibrary/docLibrary.models';
import { Breadcrumbs, BreadcrumbsProps, BreadcrumbsItemData } from '../../Breadcrumbs/Breadcrumbs';
import { Library } from '../../Icons/Library';

import '!style-loader!css-loader!sass-loader!./LibraryRegistry-Breadcrumbs.scss';
import '!style-loader!css-loader!sass-loader!../BreadcrumbsIcon/LibraryRegistry-BreadcrumbsIcon.scss';

const cnLibraryRegistryBreadcrumbs = cn('LibraryRegistry', 'Breadcrumbs');
const cnLibraryRegistryBreadcrumbsIcon = cn('LibraryRegistry', 'BreadcrumbsIcon');

interface LibraryRegistryBreadcrumbsProps {
  library: DocumentLibrary;
  path: number[];
  filter: FilterQuery;
  fromHome?: boolean;
  size?: BreadcrumbsProps['size'];
  onItemClick(path: number[]): void;
  menuButtonOnly?: boolean;
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
    const { size = 'medium', menuButtonOnly } = this.props;

    return (
      <Breadcrumbs
        className={cnLibraryRegistryBreadcrumbs({ size, menuButtonOnly })}
        items={this.items}
        itemsType='link'
        size={size}
        menuButtonOnly={menuButtonOnly}
      />
    );
  }

  @computed
  private get items(): BreadcrumbsItemData[] {
    const { filter, library, fromHome, onItemClick } = this.props;
    const items: BreadcrumbsItemData[] = [];

    if (fromHome) {
      const libraryRootUrlItems = ['r', 'root', 'lr', 'libraryRoot'];
      const libraryRootPath = JSON.stringify([...libraryRootUrlItems, 'none', 'none']);

      items.push(
        { title: <HomeOutlined />, url: '/data-management' },
        {
          title: (
            <>
              <Library color='primary' fontSize='small' className={cnLibraryRegistryBreadcrumbsIcon()} />
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
        ...this.records.map(({ title, path, id }) => {
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
