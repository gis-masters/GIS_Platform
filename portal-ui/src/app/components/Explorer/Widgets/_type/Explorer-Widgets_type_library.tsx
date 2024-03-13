import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';

import { currentUser } from '../../../../stores/CurrentUser.store';
import { getLibrary } from '../../../../services/data/library/library.service';
import { Library } from '../../../../services/data/library/library.models';
import { Role } from '../../../../services/data/permissions/permissions.models';
import { PermissionsWidget } from '../../../PermissionsWidget/PermissionsWidget';

import { cnExplorerWidgets, ExplorerWidgetsProps } from '../Explorer-Widgets.base';
import { ExplorerItemData, ExplorerItemEntityTypeTitle, ExplorerItemType } from '../../Explorer.models';
import { getId } from '../../Adapter/Explorer-Adapter';
import { libraryClient } from '../../../../services/data/library/library.client';

@observer
class ExplorerWidgetsTypeLibrary extends Component<ExplorerWidgetsProps> {
  @observable private currentLibrary?: Library;
  private operationId?: symbol;

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
    const { payload } = item as ExplorerItemData<Library>;

    return (
      <div className={cnExplorerWidgets(null, [className])}>
        {this.currentLibrary && (
          <>
            <PermissionsWidget
              url={libraryClient.getDocumentLibraryRoleAssignmentUrl(payload.table_name)}
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
    const { payload } = item as ExplorerItemData<Library>;

    const operationId = Symbol();
    this.operationId = operationId;

    const library = await getLibrary(payload.table_name);

    if (this.operationId === operationId) {
      this.setCurrentLibrary(library);
    }
  }

  @action
  private setCurrentLibrary(library: Library) {
    this.currentLibrary = library;
  }
}

export const withTypeLibrary = withBemMod<ExplorerWidgetsProps, ExplorerWidgetsProps>(
  cnExplorerWidgets(),
  { type: ExplorerItemType.LIBRARY },
  () => ExplorerWidgetsTypeLibrary
);
