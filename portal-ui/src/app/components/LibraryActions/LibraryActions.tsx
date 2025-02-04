import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { isEqual } from 'lodash';

import { Library } from '../../services/data/library/library.models';
import { getLibrary } from '../../services/data/library/library.service';
import { Role } from '../../services/permissions/permissions.models';
import { currentUser } from '../../stores/CurrentUser.store';
import { SchemaActionsEdit } from '../SchemaActions/Edit/SchemaActions-Edit';

interface LibraryActionsProps {
  library: Library;
}

@observer
export class LibraryActions extends Component<LibraryActionsProps> {
  @observable private library?: Library;
  private operationId?: symbol;

  constructor(props: LibraryActionsProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    await this.init();
  }

  async componentDidUpdate(prevProps: LibraryActionsProps) {
    if (!isEqual(this.props.library, prevProps.library)) {
      await this.init();
    }
  }

  render() {
    const canEdit = currentUser.isAdmin || this.library?.role === Role.OWNER;

    return (
      this.library && (
        <SchemaActionsEdit
          withPreview
          readonly={!canEdit}
          item={this.library}
          schema={this.library.schema}
          as='iconButton'
        />
      )
    );
  }

  private async init() {
    const operationId = Symbol();
    this.operationId = operationId;
    let { library } = this.props;

    library = library.role ? library : await getLibrary(library.table_name);

    if (this.operationId === operationId) {
      this.setLibrary(library);
    }
  }

  @action
  private setLibrary(library: Library) {
    this.library = library;
  }
}
