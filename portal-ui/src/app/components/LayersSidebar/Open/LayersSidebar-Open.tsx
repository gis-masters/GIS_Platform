import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { sidebars } from '../../../stores/Sidebars.store';

import '!style-loader!css-loader!sass-loader!./LayersSidebar-Open.scss';

const cnLayersSidebarOpen = cn('LayersSidebar', 'Open');

@observer
export class LayersSidebarOpen extends Component {
  render() {
    return <button className={cnLayersSidebarOpen({ open: sidebars.layerSidebarOpen })} onClick={this.toggleOpen} />;
  }

  @boundMethod
  private toggleOpen() {
    if (sidebars.layerSidebarOpen) {
      sidebars.closeLayersSidebar();
    } else {
      sidebars.openLayersSidebar();
    }
  }
}
