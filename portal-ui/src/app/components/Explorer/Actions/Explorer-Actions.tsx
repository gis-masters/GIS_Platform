import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { action, observable } from 'mobx';

import { ActionIntegrationSed } from '../../ActionIntegrationSed/ActionIntegrationSed';
import { communicationService } from '../../../services/communication.service';
import { ExplorerActionShare } from '../ActionShare/Explorer-ActionShare';
import { LibraryRecord } from '../../../services/crg/doc-library.service';
import { getAllowedActions, getId } from '../Adapter/Explorer-Adapter';
import { ExplorerActionEdit } from '../ActionEdit/Explorer-ActionEdit';
import { ActionDownload } from '../../ActionDownload/ActionDownload';
import { ActionType, AllowedActions } from '../Explorer.models';
import { ActionDelete } from '../../ActionDelete/ActionDelete';
import { ExplorerStore } from '../Explorer.store';

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
      [ActionType.DELETE]: deleteAction,
      [ActionType.SHARE]: shareAction
    } = this.allowedActions;

    return (
      selectedItem &&
      hasActions && (
        <div className={cnExplorer('Actions')}>
          {shareAction && <ExplorerActionShare actionDetails={shareAction} />}
          {editAction && <ExplorerActionEdit store={store} actionDetails={editAction} />}
          {downloadAction && <ActionDownload actionDetails={downloadAction} iconButton />}
          {integrationSedAction && (
            <ActionIntegrationSed
              item={selectedItem.payload as LibraryRecord}
              actionDetails={integrationSedAction}
              iconButton
            />
          )}
          {deleteAction && <ActionDelete item={selectedItem} actionDetails={deleteAction} iconButton />}
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
