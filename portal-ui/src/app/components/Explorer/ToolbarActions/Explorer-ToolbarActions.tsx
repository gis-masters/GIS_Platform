import React, { Component, ReactNode } from 'react';
import { action, IReactionDisposer, makeObservable, observable, reaction } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { getToolbarActions } from '../Adapter/Explorer-Adapter';
import { ExplorerService } from '../Explorer.service';
import { ExplorerStore } from '../Explorer.store';

import '!style-loader!css-loader!sass-loader!./Explorer-ToolbarActions.scss';

const cnExplorerToolbarActions = cn('Explorer', 'ToolbarActions');

interface ExplorerToolbarActionsProps {
  store: ExplorerStore;
  service: ExplorerService;
  full: boolean;
}

@observer
export class ExplorerToolbarActions extends Component<ExplorerToolbarActionsProps> {
  @observable private counter = 0;

  private toolbarActions: ReactNode;
  private reactionDisposer?: IReactionDisposer;

  constructor(props: ExplorerToolbarActionsProps) {
    super(props);
    makeObservable(this);
  }

  componentDidMount() {
    this.reactionDisposer = reaction(
      () => {
        const { store, full } = this.props;

        return [{ ...store.openedItem }, full];
      },
      async () => {
        const { store, service, full } = this.props;
        const openedItem = store.path.at(-2);
        if (!openedItem) {
          return;
        }
        this.setToolbarActions(await getToolbarActions(openedItem, store, service, full));
      },
      {
        fireImmediately: true
      }
    );
  }

  componentWillUnmount() {
    this.reactionDisposer?.();
  }

  render() {
    return this.checkToolbarActions ? (
      <div className={cnExplorerToolbarActions()}>{this.counter ? this.toolbarActions : ''}</div>
    ) : null;
  }

  @action
  private setToolbarActions(toolbarActions: ReactNode) {
    this.counter = Math.random();

    this.toolbarActions = toolbarActions;
  }

  private get checkToolbarActions() {
    return this.props.store.path.length > 1 ? this.toolbarActions : null;
  }
}
