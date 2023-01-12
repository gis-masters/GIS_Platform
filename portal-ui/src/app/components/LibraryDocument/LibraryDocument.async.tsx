import React, { Component } from 'react';
import { observable, action, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { IClassNameProps } from '@bem-react/core';
import { cn } from '@bem-react/classname';

import { currentUser } from '../../stores/CurrentUser.store';
import { formatDate } from '../../services/util/date.util';
import { Role } from '../../services/data/permissions.models';
import { schemaService } from '../../services/data/schema.service';
import { applyContentType } from '../../services/data/schema.utils';
import { LibraryRecord } from '../../services/data/doc-library.service';
import { PropertyType, Schema } from '../../services/data/schema.models';
import { ExplorerItemEntityTypeTitle } from '../Explorer/Explorer.models';
import { getLibraryRecordBreadcrumbs } from '../DataManagement/DataManagement.utils';
import { getDocumentLibraryRecordRoleAssignmentUrl } from '../../services/server-urls.service';
import { Breadcrumbs, BreadcrumbsItemData } from '../Breadcrumbs/Breadcrumbs';
import { ViewContentWidget } from '../ViewContentWidget/ViewContentWidget';
import { PermissionsWidget } from '../PermissionsWidget/PermissionsWidget';

import '!style-loader!css-loader!sass-loader!./LibraryDocument.scss';

const cnLibraryDocument = cn('LibraryDocument');

export interface LibraryDocumentProps extends IClassNameProps {
  document: LibraryRecord;
}

@observer
export default class LibraryDocument extends Component<LibraryDocumentProps> {
  @observable private schema: Schema;
  @observable private documentRoleAssignmentUrl: string;
  @observable private breadcrumbsItems: BreadcrumbsItemData[] = [];

  constructor(props: LibraryDocumentProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    await this.fetchSchema();
    await this.fetchDocumentPermissionUrl();

    if (document) {
      await this.getBreadcrumbsItems();
    }
  }

  render() {
    const { document, className } = this.props;

    return (
      <div className={cnLibraryDocument(null, [className])}>
        <Breadcrumbs className={cnLibraryDocument('Breadcrumbs')} itemsType='link' items={this.breadcrumbsItems} />

        <div className={cnLibraryDocument('DocumentCard')}>
          {this.schema && <ViewContentWidget schema={this.schema} data={document} title='Карточка документа' />}
        </div>

        <div className={cnLibraryDocument('Date')}>
          <span className={cnLibraryDocument('DateTitle')}>Дата создания:</span>
          {formatDate(document.created_at, 'LL')}
        </div>

        {this.documentRoleAssignmentUrl && (
          <PermissionsWidget
            url={this.documentRoleAssignmentUrl}
            title={document.title}
            itemEntityType={ExplorerItemEntityTypeTitle.DOCUMENT}
            disabled={!(currentUser.isAdmin || document.role === Role.OWNER)}
          />
        )}
      </div>
    );
  }

  private async fetchSchema(): Promise<void> {
    const { document } = this.props;
    const schema = applyContentType(await schemaService.getSchema(document.schemaId), document.content_type_id);

    this.setSchema({
      ...schema,
      properties: schema.properties.filter(({ propertyType }) => propertyType !== PropertyType.BINARY)
    });
  }

  private async fetchDocumentPermissionUrl(): Promise<void> {
    const { document } = this.props;
    const url = await getDocumentLibraryRecordRoleAssignmentUrl(document.libraryId, document.id);
    this.setDocumentRoleAssignmentUrl(url);
  }

  @action.bound
  private setSchema(schema: Schema) {
    this.schema = schema;
  }

  @action.bound
  private setDocumentRoleAssignmentUrl(url: string) {
    this.documentRoleAssignmentUrl = url;
  }

  private async getBreadcrumbsItems() {
    this.setBreadcrumbsItems(await getLibraryRecordBreadcrumbs(this.props.document, true));
  }

  @action.bound
  private setBreadcrumbsItems(breadcrumbsItems: BreadcrumbsItemData[]) {
    this.breadcrumbsItems = breadcrumbsItems;
  }
}
