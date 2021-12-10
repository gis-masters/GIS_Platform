import React, { Component } from 'react';
import {} from 'mobx';
import { observer } from 'mobx-react';
import { ShareOutlined } from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { LibraryRecord } from '../../../services/crg/doc-library.service';
import { copyToClipboard } from '../../../services/util/clipboard.util';
import { Toast } from '../../Toast/Toast';

import { ActionsItemVariant } from '../Item/LibraryDocumentActions-Item';
import { LibraryDocumentActionsItem } from '../Item/LibraryDocumentActions-Item.composed';

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
      <LibraryDocumentActionsItem
        className={cnLibraryDocumentActionsShare()}
        title='Копировать ссылку'
        icon={<ShareOutlined />}
        onClick={this.clickHandler}
        as={as}
      />
    );
  }

  @boundMethod
  private clickHandler() {
    const { document } = this.props;
    copyToClipboard(
      `${location.protocol}//${location.host}/data-management/library/${document.libraryId}/document/${document.id}`
    );
    Toast.success('Сохранено в буфер обмена');
  }
}
