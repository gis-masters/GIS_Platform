import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { IconButton, Tooltip } from '@mui/material';
import { ShareOutlined } from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { services } from '../../../services/services';
import { copyToClipboard } from '../../../services/util/clipboard.util';
import { Toast } from '../../Toast/Toast';

import { ActionDetailsShare } from '../Explorer.models';

const cnExplorerActionShare = cn('Explorer', 'ActionShare');

interface ExplorerActionShareProps {
  actionDetails: ActionDetailsShare;
}

@observer
export class ExplorerActionShare extends Component<ExplorerActionShareProps> {
  render() {
    return (
      <Tooltip title='Копировать ссылку на документ'>
        <span>
          <IconButton className={cnExplorerActionShare()} onClick={this.clickHandler}>
            <ShareOutlined />
          </IconButton>
        </span>
      </Tooltip>
    );
  }

  @boundMethod
  private async clickHandler() {
    await services.provided;
    copyToClipboard(this.props.actionDetails.url);
    Toast.success('Сохранено в буфер обмена');
  }
}
