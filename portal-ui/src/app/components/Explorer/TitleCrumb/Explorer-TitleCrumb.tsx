import React, { Component } from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { Button } from '../../Button/Button';

import { ExplorerStore } from '../Explorer.store';
import { ExplorerItemData } from '../Explorer.models';
import { getTitle } from '../Adapter/Explorer-Adapter';

import '!style-loader!css-loader!sass-loader!./Explorer-TitleCrumb.scss';

const cnExplorerTitleCrumb = cn('Explorer', 'TitleCrumb');

interface ExplorerTitleCrumbProps {
  depth: number;
  store: ExplorerStore;
  onOpen: (item: ExplorerItemData, page: number, depth: number) => void;
}

@observer
export class ExplorerTitleCrumb extends Component<ExplorerTitleCrumbProps> {
  render() {
    const { depth, store } = this.props;
    const title = getTitle(store.path[depth]);

    return (
      <Button className={cnExplorerTitleCrumb()} variant='text' onClick={this.handleClick}>
        {title}
      </Button>
    );
  }

  @action.bound
  private handleClick() {
    const { depth, store, onOpen } = this.props;

    onOpen(store.path[depth], 0, depth);
  }
}
