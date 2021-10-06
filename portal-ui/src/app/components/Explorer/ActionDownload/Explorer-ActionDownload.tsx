import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { GetApp } from '@mui/icons-material';

import { Link } from '../../Link/Link';
import { Button } from '../../Button/Button';

import { ExplorerStore } from '../Explorer.store';
import { ActionDetails } from '../Explorer.models';

const cnExplorerActionDownload = cn('Explorer', 'ActionDownload');

interface ExplorerActionDownloadProps {
  store: ExplorerStore;
  actionDetails: ActionDetails;
}

@observer
export class ExplorerActionDownload extends Component<ExplorerActionDownloadProps> {
  render() {
    const { actionDetails } = this.props;
    const { fileName, url, visible } = actionDetails;

    return (
      visible && (
        <Link className={cnExplorerActionDownload()} url={url} download={fileName} theme='none'>
          <Button startIcon={<GetApp />}>Скачать</Button>
        </Link>
      )
    );
  }
}
