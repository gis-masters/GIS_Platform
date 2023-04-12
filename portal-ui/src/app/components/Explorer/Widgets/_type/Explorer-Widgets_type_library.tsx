import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';

import { currentUser } from '../../../../stores/CurrentUser.store';
import { getLibrary } from '../../../../services/data/docLibrary/docLibrary.service';
import { DocumentLibrary } from '../../../../services/data/docLibrary/docLibrary.models';
import { Role } from '../../../../services/data/permissions/permissions.models';
import { PermissionsWidget } from '../../../PermissionsWidget/PermissionsWidget';

import { cnExplorerWidgets, ExplorerWidgetsProps } from '../Explorer-Widgets.base';
import { ExplorerItemData, ExplorerItemEntityTypeTitle, ExplorerItemType } from '../../Explorer.models';
import { getId } from '../../Adapter/Explorer-Adapter';
import { docLibraryClient } from '../../../../services/data/docLibrary/docLibrary.client';

@observer
class ExplorerWidgetsTypeLibrary extends Component<ExplorerWidgetsProps> {
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
    const { className, item } = this.props;
    const { payload } = item as ExplorerItemData<DocumentLibrary>;

    return (
      <div className={cnExplorerWidgets(null, [className])}>
        {this.currentLibrary && (
          <>
            <PermissionsWidget
              url={docLibraryClient.getDocumentLibraryRoleAssignmentUrl(payload.table_name)}
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

    const library = await getLibrary(payload.table_name);

    if (this.operationId === operationId) {
      this.setCurrentLibrary(library);
    }
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
