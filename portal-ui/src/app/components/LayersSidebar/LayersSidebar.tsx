import React, { Component, CSSProperties } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { sidebars } from '../../stores/Sidebars.store';
import { BaseMapsSelect } from '../BaseMapsSelect/BaseMapsSelect';
import { LayersTree } from '../LayersTree/LayersTree';

import '!style-loader!css-loader!sass-loader!./LayersSidebar.scss';

const cnLayersSidebar = cn('LayersSidebar');

@observer
export class LayersSidebar extends Component {
  render() {
    return (
      <div className={cnLayersSidebar({ open: sidebars.leftOpen })}>
        <button className={cnLayersSidebar('Open', { open: sidebars.leftOpen })} onClick={this.toggleOpen} />
        <div className={cnLayersSidebar('Inner')}>
          <div className={cnLayersSidebar('Content', ['scroll'])}>
            <LayersTree />
          </div>
        </div>
      </div>
    );
  }

  @boundMethod
  private toggleOpen() {
    if (sidebars.leftOpen) {
      sidebars.closeLeft();
    } else {
      sidebars.openLeft();
    }
  }
}
