import React, { Component } from 'react';
import { observable, action, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { IClassNameProps } from '@bem-react/core';
import { cn } from '@bem-react/classname';
import { isEqual } from 'lodash';

import { currentUser } from '../../stores/CurrentUser.store';
import { formatDate } from '../../services/util/date.util';
import { Role } from '../../services/data/permissions/permissions.models';
import { schemaService } from '../../services/data/schema/schema.service';
import { applyContentType } from '../../services/data/schema/schema.utils';
import { LibraryRecord } from '../../services/data/docLibrary/docLibrary.models';
import { PropertyType, Schema } from '../../services/data/schema/schema.models';
import { ExplorerItemEntityTypeTitle } from '../Explorer/Explorer.models';
import { getLibraryRecordBreadcrumbs } from '../DataManagement/DataManagement.utils';
import { docLibraryClient } from '../../services/data/docLibrary/docLibrary.client';
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
          {formatDate(document.created_at, 'LL')}
        </div>

        <PermissionsWidget
          url={docLibraryClient.getDocumentLibraryRecordRoleAssignmentUrl(document.libraryTableName, document.id)}
          title={document.title}
          itemEntityType={ExplorerItemEntityTypeTitle.DOCUMENT}
          disabled={!(currentUser.isAdmin || document.role === Role.OWNER)}
        />
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

  @action.bound
  private setSchema(schema: Schema) {
    this.schema = schema;
  }

  private async getBreadcrumbsItems() {
    this.setBreadcrumbsItems(await getLibraryRecordBreadcrumbs(this.props.document, true));
  }

  @action.bound
  private setBreadcrumbsItems(breadcrumbsItems: BreadcrumbsItemData[]) {
    this.breadcrumbsItems = breadcrumbsItems;
  }
}
