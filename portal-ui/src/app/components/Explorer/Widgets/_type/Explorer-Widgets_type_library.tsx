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
import { ExplorerItemEntityTypeTitle, ExplorerItemType } from '../../Explorer.models';
import { getId } from '../../Adapter/Explorer-Adapter';
import { libraryClient } from '../../../../services/data/library/library.client';
import { assertExplorerItemDataTypeLibrary } from '../../Adapter/_type/Explorer-Adapter_type_library';

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

    assertExplorerItemDataTypeLibrary(item);

    return (
      <div className={cnExplorerWidgets(null, [className])}>
        {this.currentLibrary && (
          <>
            <PermissionsWidget
              url={libraryClient.getDocumentLibraryRoleAssignmentUrl(item.payload.table_name)}
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

    assertExplorerItemDataTypeLibrary(item);

    const operationId = Symbol();
    this.operationId = operationId;

    const library = await getLibrary(item.payload.table_name);

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
