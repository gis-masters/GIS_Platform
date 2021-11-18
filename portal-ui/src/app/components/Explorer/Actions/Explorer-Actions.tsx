import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { action, observable } from 'mobx';

import { communicationService } from '../../../services/communication.service';

import { ExplorerStore } from '../Explorer.store';
import { ActionType, AllowedActions } from '../Explorer.models';
import { getAllowedActions, getId } from '../Adapter/Explorer-Adapter';
import { ExplorerActionEdit } from '../ActionEdit/Explorer-ActionEdit';
import { ExplorerActionDelete } from '../ActionDelete/Explorer-ActionDelete';
import { ExplorerActionDownload } from '../ActionDownload/Explorer-ActionDownload';
import { ExplorerActionIntegrationSed } from '../ActionIntegrationSed/Explorer-ActionIntegrationSed';

import '!style-loader!css-loader!sass-loader!./Explorer-Actions.scss';

const cnExplorer = cn('Explorer');

interface ExplorerActionsProps {
  store: ExplorerStore;
}

@observer
export class ExplorerActions extends Component<ExplorerActionsProps> {
  private itemId: string;

  @observable private allowedActions: AllowedActions = {};

  async componentDidMount() {
    await this.fetchAllowedActions();

    communicationService.permissionsUpdated.on(async () => {
      await this.fetchAllowedActions();
    });
  }

  async componentDidUpdate() {
    await this.fetchAllowedActions();
  }

  componentWillUnmount() {
    communicationService.off(this);
  }

  render() {
    const { store } = this.props;
    const { selectedItem } = store;
    const hasActions = Object.values(this.allowedActions).some(({ visible }) => visible);
    const {
      [ActionType.EDIT]: editAction,
      [ActionType.DOWNLOAD]: downloadAction,
      [ActionType.INTEGRATION_SED]: integrationSedAction,
      [ActionType.DELETE]: deleteAction
    } = this.allowedActions;

    return (
      selectedItem &&
      hasActions && (
        <div className={cnExplorer('Actions')}>
          {editAction && <ExplorerActionEdit store={store} actionDetails={editAction} />}
          {downloadAction && <ExplorerActionDownload store={store} actionDetails={downloadAction} />}
          {integrationSedAction && <ExplorerActionIntegrationSed store={store} actionDetails={integrationSedAction} />}
          {deleteAction && <ExplorerActionDelete store={store} actionDetails={deleteAction} />}
        </div>
      )
    );
  }

  private async fetchAllowedActions() {
    const { selectedItem } = this.props.store;
    const id = getId(selectedItem);

    if (this.itemId !== id) {
      this.itemId = id;
      this.setAllowedActions(await getAllowedActions(selectedItem));
    }
  }

  @action
  private setAllowedActions(allowedActions: AllowedActions) {
    this.allowedActions = allowedActions;
  }
}
