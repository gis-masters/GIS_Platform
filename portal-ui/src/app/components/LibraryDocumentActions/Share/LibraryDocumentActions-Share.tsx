import React, { Component } from 'react';
import {} from 'mobx';
import { observer } from 'mobx-react';
import { ShareOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { LibraryRecord } from '../../../services/data/library/library.models';
import { copyToClipboard } from '../../../services/util/clipboard.util';
import { ActionsItemVariant } from '../../Actions/Item/Actions-Item.base';
import { ActionsItem } from '../../Actions/Item/Actions-Item.composed';
import { Toast } from '../../Toast/Toast';

const cnLibraryDocumentActionsShare = cn('LibraryDocumentActions', 'Share');

interface LibraryDocumentActionsShareProps {
  document: LibraryRecord;
  as: ActionsItemVariant;
}

@observer
export class LibraryDocumentActionsShare extends Component<LibraryDocumentActionsShareProps> {
  render() {
    const { as } = this.props;

    return (
      <ActionsItem
        className={cnLibraryDocumentActionsShare()}
        title='Копировать ссылку'
        icon={<ShareOutlined />}
        onClick={this.handleClick}
        as={as}
      />
    );
  }

  @boundMethod
  private handleClick() {
    const { document } = this.props;
    copyToClipboard(
      `${location.protocol}//${location.host}/data-management/library/${document.libraryTableName}/document/${document.id}`
    );
    Toast.success('Сохранено в буфер обмена');
  }
}
