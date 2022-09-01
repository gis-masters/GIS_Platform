import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';

import { getDocumentLibraryRecordRoleAssignmentUrl } from '../../../../services/server-urls.service';
import { getLibraryRecord, LibraryRecord } from '../../../../services/data/doc-library.service';
import { ViewContentWidget } from '../../../ViewContentWidget/ViewContentWidget';
import { PermissionsWidget } from '../../../PermissionsWidget/PermissionsWidget';
import { applyContentType } from '../../../../services/data/schema.utils';
import { schemaService } from '../../../../services/data/schema.service';
import { Role } from '../../../../services/data/permissions.models';
import { currentUser } from '../../../../stores/CurrentUser.store';
import { Schema } from '../../../../services/data/schema.models';

import { ExplorerItemData, ExplorerItemEntityTypeTitle, ExplorerItemType } from '../../Explorer.models';
import { cnExplorerWidgets, ExplorerWidgetsProps } from '../Explorer-Widgets.base';
import { ExplorerInfoDescItem } from '../../InfoDescItem/Explorer-InfoDescItem';
import { getId } from '../../Adapter/Explorer-Adapter';

@observer
export class ExplorerWidgetsTypeLibraryRecord extends Component<ExplorerWidgetsProps> {
  @observable private url?: string;
  @observable private schema?: Schema;
  @observable private currentRecord?: LibraryRecord;
  private operationId: symbol;

  constructor(props: ExplorerWidgetsProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    await this.fetchData();
  }

  async componentDidUpdate(prevProps: Readonly<ExplorerWidgetsProps>) {
    const { item } = this.props;
    if (getId(item) !== getId(prevProps.item)) {
      await this.fetchData();
    }
  }

  render() {
    const { className, type } = this.props;

    return (
      <div className={cnExplorerWidgets(null, [className])}>
        {this.currentRecord && (
          <>
            <ExplorerInfoDescItem multiline>
              <ViewContentWidget schema={this.schema} data={this.currentRecord} />
            </ExplorerInfoDescItem>
            <PermissionsWidget
              url={this.url}
              title={this.currentRecord.title}
              itemEntityType={
                type === ExplorerItemType.DOCUMENT
                  ? ExplorerItemEntityTypeTitle.DOCUMENT
                  : ExplorerItemEntityTypeTitle.FOLDER
              }
              disabled={!(currentUser.isAdmin || this.currentRecord.role === Role.OWNER)}
            />
          </>
        )}
      </div>
    );
  }

  private async fetchData() {
    const { item } = this.props;
    const { payload } = item as ExplorerItemData<LibraryRecord>;
    const operationId = Symbol();
    this.operationId = operationId;

    const url = await getDocumentLibraryRecordRoleAssignmentUrl(payload.libraryId, payload.id);
    const schema = await schemaService.getSchema(payload.schemaId);
    const record = await getLibraryRecord(payload.libraryId, payload.id);

    if (this.operationId === operationId) {
      this.setUrl(url);
      this.setSchema(applyContentType(schema, payload.content_type_id));
      this.setCurrentRecord(record);
    }
  }

  @action
  private setUrl(url: string) {
    this.url = url;
  }

  @action
  private setSchema(schema: Schema) {
    this.schema = schema;
  }

  @action
  private setCurrentRecord(record: LibraryRecord) {
    this.currentRecord = record;
  }
}
