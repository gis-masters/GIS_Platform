import React, { Component, ReactNode } from 'react';
import { observer } from 'mobx-react';
import { action, IReactionDisposer, observable, reaction } from 'mobx';
import { IClassNameProps } from '@bem-react/core';
import { Card } from '@mui/material';
import { cn } from '@bem-react/classname';

import { ExplorerStore } from '../Explorer.store';
import { getDescription, getWidgets, getTitle, getId } from '../Adapter/Explorer-Adapter';
import { ExplorerInfoContent } from '../InfoContent/Explorer-InfoContent';
import { ExplorerInfoTitle } from '../InfoTitle/Explorer-InfoTitle';
import { ExplorerActions } from '../Actions/Explorer-Actions';

import '!style-loader!css-loader!sass-loader!./Explorer-Info.scss';

export const cnExplorerInfo = cn('Explorer', 'Info');

export interface ExplorerInfoProps extends IClassNameProps {
  store: ExplorerStore;
}

@observer
export class ExplorerInfo extends Component<ExplorerInfoProps> {
  @observable private widgets: ReactNode;
  private reactionDisposer: IReactionDisposer;

  componentDidMount() {
    this.reactionDisposer = reaction(
      () => {
        const { selectedItem } = this.props.store;

        return [selectedItem.type, getId(selectedItem)];
      },
      async () => {
        this.setWidgets(await getWidgets(this.props.store.selectedItem));
      },
      {
        fireImmediately: true
      }
    );
  }

  componentWillUnmount() {
    this.reactionDisposer();
  }

  render() {
    const { className, store } = this.props;
    const { selectedItem } = store;

    return (
      <Card className={cnExplorerInfo({}, [className])} elevation={3} square>
        <ExplorerInfoContent>
          <ExplorerInfoTitle>{getTitle(selectedItem)}</ExplorerInfoTitle>
          {this.renderContent()}
          {this.widgets ? this.widgets : ''}
        </ExplorerInfoContent>
        <ExplorerActions store={store} />
      </Card>
    );
  }

  @action
  private setWidgets(widgets: ReactNode) {
    this.widgets = widgets;
  }

  private renderContent() {
    const description = getDescription(this.props.store.selectedItem);

    return <>{description}</>;
  }
}
