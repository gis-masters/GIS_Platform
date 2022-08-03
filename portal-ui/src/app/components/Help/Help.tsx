import React, { Component } from 'react';
import { observable, computed, action, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { HelpPart } from '../../services/HelpPart';
import { TocItem } from '../../stores/Help.store';
import { HelpToc } from '../HelpToc/HelpToc';

import '!style-loader!css-loader!sass-loader!./Help.scss';

const cnHelp = cn('Help');

interface HelpProps {
  path?: string;
  helpPart?: HelpPart;
  className?: string;
  selectedItem?: TocItem;
}

@observer
export class Help extends Component<HelpProps> {
  @observable private selectedItem: TocItem;

  private helpPart: HelpPart;

  constructor(props: HelpProps) {
    super(props);
    makeObservable(this);

    this.helpPart = this.props.helpPart || new HelpPart(this.props.path);
  }

  async componentDidMount() {
    await this.helpPart.initContent();
  }

  render() {
    const { items } = this.helpPart;

    if (!items) {
      return null;
    }

    return (
      <div className={cnHelp()}>
        {items.length > 1 ? (
          <HelpToc
            className={cnHelp('Toc', ['scroll'])}
            items={items}
            onSelect={this.selectHandler}
            selectedItem={this.currentItem}
          />
        ) : null}
        <div className={cnHelp('Content', ['scroll'])} dangerouslySetInnerHTML={{ __html: this.currentItem.content }} />
      </div>
    );
  }

  @computed
  get currentItem(): TocItem {
    return this.selectedItem || this.props.selectedItem || this.helpPart.items[0];
  }

  @action.bound
  private selectHandler(item: TocItem) {
    this.selectedItem = item;
  }
}
