import React, { Component, CSSProperties } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { BaseMapsSelect } from '../BaseMapsSelect/BaseMapsSelect';
import { PrintButton } from '../PrintButton/PrintButton';
import { LayersTree } from '../LayersTree/LayersTree';

import '!style-loader!css-loader!sass-loader!./LayersSidebar.scss';

const cnLayersSidebar = cn('LayersSidebar');

const ANIMATION_DURATION = 300;

@observer
export class LayersSidebar extends Component<{}> {
  @observable private open = true;

  constructor (props: {}) {
    super(props);

    this.toggleOpen = this.toggleOpen.bind(this);
  }

  render () {
    const style = { '--LayersSidebarOpeningDuration': ANIMATION_DURATION + 'ms' } as CSSProperties;

    return (
      <div className={cnLayersSidebar({ open: this.open })} style={style}>
        <button className={cnLayersSidebar('Open', { open: this.open })} onClick={this.toggleOpen} />
        <div className={cnLayersSidebar('Inner')}>
          <div className={cnLayersSidebar('MapControls')}>
            <BaseMapsSelect className={cnLayersSidebar('BaseMapsSelect')} />
            <PrintButton />
          </div>
          <div className={cnLayersSidebar('Content', ['scroll'])}>
            <LayersTree />
          </div>
        </div>
      </div>
    );
  }

  @action
  private toggleOpen () {
    this.open = !this.open;

    const interval = setInterval(() => {
      window.dispatchEvent(new Event('resize'));
    }, 20);

    setTimeout(() => {
      clearInterval(interval);
    }, ANIMATION_DURATION);
  }
}
