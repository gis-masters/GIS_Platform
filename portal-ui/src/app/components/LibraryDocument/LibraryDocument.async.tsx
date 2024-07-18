import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { HomeOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';
import { AxiosError } from 'axios';
import { isEqual } from 'lodash';

import { libraryClient } from '../../services/data/library/library.client';
import { LibraryRecord } from '../../services/data/library/library.models';
import { getLibrary, getLibraryRecord, getLibrarySchemaByRecord } from '../../services/data/library/library.service';
import { PropertyType, Schema } from '../../services/data/schema/schema.models';
import { applyContentType } from '../../services/data/schema/schema.utils';
import { Role } from '../../services/permissions/permissions.models';
import { services } from '../../services/services';
import { formatDate } from '../../services/util/date.util';
import { notFalsyFilter } from '../../services/util/NotFalsyFilter';
import { currentUser } from '../../stores/CurrentUser.store';
import { Breadcrumbs, BreadcrumbsItemData } from '../Breadcrumbs/Breadcrumbs';
import { getIdsFromPath, libraryRootUrlItems } from '../DataManagement/DataManagement.utils';
import { ExplorerItemEntityTypeTitle } from '../Explorer/Explorer.models';
import { PermissionsWidget } from '../PermissionsWidget/PermissionsWidget';
import { Toast } from '../Toast/Toast';
import { ViewContentWidget } from '../ViewContentWidget/ViewContentWidget';

import '!style-loader!css-loader!sass-loader!./LibraryDocument.scss';

const cnLibraryDocument = cn('LibraryDocument');

export interface LibraryDocumentProps extends IClassNameProps {
  document: LibraryRecord;
}

@observer
export default class LibraryDocument extends Component<LibraryDocumentProps> {
  @observable private schema?: Schema;
  @observable private breadcrumbsItems: BreadcrumbsItemData[] = [];

  constructor(props: LibraryDocumentProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    await this.fetchSchema();

    if (document) {
      await this.getBreadcrumbsItems();
    }
  }

  async componentDidUpdate(prevProps: LibraryDocumentProps) {
    const { document } = this.props;
    if (!isEqual(prevProps.document, document)) {
      await this.getBreadcrumbsItems();
    }
  }

  render() {
    const { document, className } = this.props;

    return (
      <div className={cnLibraryDocument(null, [className])}>
        <Breadcrumbs className={cnLibraryDocument('Breadcrumbs')} itemsType='link' items={this.breadcrumbsItems} />

        <div className={cnLibraryDocument('DocumentCard')}>
          {this.schema && (
            <ViewContentWidget
              formRole='viewDocument'
              schema={this.schema}
              data={document}
              title='Карточка документа'
            />
          )}
        </div>

        <div className={cnLibraryDocument('Date')}>
          <span className={cnLibraryDocument('DateTitle')}>Дата создания:</span>
          {document.created_at && formatDate(document.created_at, 'LL')}
        </div>

        <PermissionsWidget
          url={libraryClient.getDocumentLibraryRecordRoleAssignmentUrl(document.libraryTableName, document.id)}
          title={document.title}
          itemEntityType={ExplorerItemEntityTypeTitle.DOCUMENT}
          disabled={!(currentUser.isAdmin || document.role === Role.OWNER)}
        />
      </div>
    );
  }

  private async fetchSchema(): Promise<void> {
    const { document } = this.props;
    const schema = applyContentType(await getLibrarySchemaByRecord(document), document.content_type_id);

    this.setSchema({
      ...schema,
      properties: schema.properties.filter(({ propertyType }) => propertyType !== PropertyType.BINARY)
    });
  }

  @action.bound
  private setSchema(schema: Schema) {
    this.schema = schema;
  }

  private async getBreadcrumbsItems() {
    this.setBreadcrumbsItems(await this.getLibraryRecordBreadcrumbs(this.props.document, true));
  }

  @action.bound
  private setBreadcrumbsItems(breadcrumbsItems: BreadcrumbsItemData[]) {
    this.breadcrumbsItems = breadcrumbsItems;
  }

  private async getLibraryRecordBreadcrumbs(
    item: LibraryRecord,
    includeSelf?: boolean
  ): Promise<BreadcrumbsItemData[]> {
    const { libraryTableName, path, id, title, is_folder: isFolder } = item;
    const libraryRootPath = JSON.stringify([...libraryRootUrlItems, 'none', 'none']);
    const libraryPath = JSON.stringify([...libraryRootUrlItems, 'library', libraryTableName, 'none', 'none']);
    const library = await getLibrary(libraryTableName);
    const currentItem = isFolder ? ['folder', id] : ['doc', id];
    const breadcrumbs = [
      { title: <HomeOutlined />, url: '/data-management' },
      {
        title: 'Библиотеки документов',
        url: `/data-management?path_dm=${libraryRootPath}`
      },
      {
        title: library.title,
        url: `/data-management?path_dm=${libraryPath}`
      }
    ];

    try {
      let parentsInfo = await Promise.all(
        getIdsFromPath(path || '').map(async pathId => {
          const { id, title } = await getLibraryRecord(libraryTableName, pathId);

          return { id, title };
        })
      );

      parentsInfo = parentsInfo.filter(notFalsyFilter);

      let pathWithCurrent = '';
      const itemParentsBreadcrumbs: BreadcrumbsItemData[] = parentsInfo?.map((parent, index) => {
        const folders: (string | number)[] = [];
        for (let i = 0; i < index + 1; i++) {
          folders.push('folder', parentsInfo[i].id);
        }

        const folderPath = JSON.stringify([
          ...libraryRootUrlItems,
          'library',
          libraryTableName,
          ...folders,
          'none',
          'none'
        ]);

        if (includeSelf) {
          pathWithCurrent = JSON.stringify([
            ...libraryRootUrlItems,
            'library',
            libraryTableName,
            ...folders,
            ...currentItem
          ]);
        }

        return {
          title: parent.title,
          url: `/data-management?path_dm=${folderPath}`
        };
      });

      if (includeSelf) {
        itemParentsBreadcrumbs.push({
          title: <b>{title}</b>,
          url: `/data-management?path_dm=${
            pathWithCurrent || JSON.stringify([...libraryRootUrlItems, 'library', libraryTableName, ...currentItem])
          }`
        });
      }

      return [...breadcrumbs, ...itemParentsBreadcrumbs];
    } catch (error) {
      const err = error as AxiosError;
      Toast.warn(`Ошибка получения документа. ${err.message}`);
      services.logger.warn(`Ошибка получения документа. ${err.message}`);

      return breadcrumbs;
    }
  }
}
