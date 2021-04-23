import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { action, observable } from 'mobx';
import { CardActions } from '@material-ui/core';

import { ExplorerStore } from '../Explorer.store';
import { AllowedActions } from '../Explorer.models';
import { getAllowedActions, getId } from '../Adapter/Explorer-Adapter';
import { ExplorerActionDelete } from '../ActionDelete/Explorer-ActionDelete';
import { ExplorerActionDownload } from '../ActionDownload/Explorer-ActionDownload';

import { communicationService } from '../../../services/communication.service';

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
    const isDeleteAction = !!this.allowedActions.delete;
    const isDownloadAction = !!this.allowedActions.download;

    return (
      selectedItem &&
      hasActions && (
        <CardActions className={cnExplorer('Actions')}>
          {isDeleteAction && <ExplorerActionDelete store={store} actionDetails={this.allowedActions.delete} />}
          {isDownloadAction && <ExplorerActionDownload store={store} actionDetails={this.allowedActions.download} />}
        </CardActions>
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
