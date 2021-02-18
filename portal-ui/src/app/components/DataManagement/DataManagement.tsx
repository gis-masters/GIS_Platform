import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { Explorer } from '../Explorer/Explorer';
import { flags } from '../../services/feature-flags';
import { ExplorerItemType } from '../Explorer/Explorer.models';

import '!style-loader!css-loader!sass-loader!./DataManagement.scss';

const cnDataManagement = cn('DataManagement');

@observer
export class DataManagement extends Component {
  render() {
    return (
      flags.dataManagement && (
        <div className={cnDataManagement()}>
          <Explorer preset={ExplorerItemType.ROOT} withInfoPanel fixedHeight />
        </div>
      )
    );
  }
}
