import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';

import { currentUser } from '../../../../stores/CurrentUser.store';
import { getDocumentLibraryRoleAssignmentUrl } from '../../../../services/api/server-urls.service';
import { getLibrary } from '../../../../services/data/docLibrary/docLibrary.service';
import { DocumentLibrary } from '../../../../services/data/docLibrary/docLibrary.models';
import { Role } from '../../../../services/data/permissions/permissions.models';
import { PermissionsWidget } from '../../../PermissionsWidget/PermissionsWidget';

import { cnExplorerWidgets, ExplorerWidgetsProps } from '../Explorer-Widgets.base';
import { ExplorerItemData, ExplorerItemEntityTypeTitle, ExplorerItemType } from '../../Explorer.models';
import { getId } from '../../Adapter/Explorer-Adapter';

@observer
class ExplorerWidgetsTypeLibrary extends Component<ExplorerWidgetsProps> {
  @observable private url?: string;
  @observable private currentLibrary?: DocumentLibrary;
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
    const { className } = this.props;

    return (
      <div className={cnExplorerWidgets(null, [className])}>
        {this.currentLibrary && (
          <>
            <PermissionsWidget
              url={this.url}
              title={this.currentLibrary.title}
              itemEntityType={ExplorerItemEntityTypeTitle.LIBRARY}
              disabled={!(currentUser.isAdmin || this.currentLibrary.role === Role.OWNER)}
            />
          </>
        )}
      </div>
    );
  }

  private async fetchData() {
    const { item } = this.props;
    const { payload } = item as ExplorerItemData<DocumentLibrary>;

    const operationId = Symbol();
    this.operationId = operationId;

    const url = await getDocumentLibraryRoleAssignmentUrl(payload.table_name);
    const library = await getLibrary(payload.table_name);

    if (this.operationId === operationId) {
      this.setUrl(url);
      this.setCurrentLibrary(library);
    }
  }

  @action
  private setUrl(url: string) {
    this.url = url;
  }

  @action
  private setCurrentLibrary(library: DocumentLibrary) {
    this.currentLibrary = library;
  }
}

export const withTypeLibrary = withBemMod<ExplorerWidgetsProps, ExplorerWidgetsProps>(
  cnExplorerWidgets(),
  { type: ExplorerItemType.LIBRARY },
  () => ExplorerWidgetsTypeLibrary
);
