import React from 'react';
import { observable, computed, action } from 'mobx';
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
export class Help extends React.Component<HelpProps> {
  @observable private selectedItem: TocItem;
  
  private helpPart: HelpPart;

  constructor (props: HelpProps) {
    super(props);

    this.helpPart = this.props.helpPart || new HelpPart(this.props.path);

    this.selectHandler = this.selectHandler.bind(this);
  }

  componentDidMount () {
    this.helpPart.initContent();
  }

  render () {
    const { items } = this.helpPart;

    if (!items) {
      return null;
    }

    return (
      <div className={cnHelp()}>
        {items.length > 1 ? (
          <HelpToc className={cnHelp('Toc')}
                   items={items}
                   onSelect={this.selectHandler}
                   selectedItem={this.currentItem} />
        ) : null}

        <div className={cnHelp('Content')} dangerouslySetInnerHTML={{__html: this.currentItem.content}} />
      </div>
    );
  }

  @computed
  get currentItem (): TocItem {
    return this.selectedItem || this.props.selectedItem || this.helpPart.items[0];
  }

  @action
  private selectHandler (item: TocItem) {
    this.selectedItem = item;
  }
}
