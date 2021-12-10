import React, { Component } from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { DownloadOutlined } from '@mui/icons-material';

import { cn } from '@bem-react/classname';

import { getDocLibrariesRecordsUrl } from '../../../services/server-urls.service';
import { LibraryRecord } from '../../../services/crg/doc-library.service';

import { ActionsItemVariant } from '../Item/LibraryDocumentActions-Item';
import { LibraryDocumentActionsItem } from '../Item/LibraryDocumentActions-Item.composed';

const cnLibraryDocumentActionsDownload = cn('LibraryDocumentActions', 'Download');

interface LibraryDocumentActionsDownloadProps {
  document: LibraryRecord;
  as: ActionsItemVariant;
}

@observer
export class LibraryDocumentActionsDownload extends Component<LibraryDocumentActionsDownloadProps> {
  @observable private url: string;

  async componentDidMount() {
    const { document } = this.props;

    this.setUrl(`${await getDocLibrariesRecordsUrl(document.libraryId)}/${document.id}/inner_path/download`);
  }

  render() {
    const { as } = this.props;

    return (
      <LibraryDocumentActionsItem
        className={cnLibraryDocumentActionsDownload()}
        title='Скачать'
        as={as}
        url={this.url}
        download
        icon={<DownloadOutlined />}
      />
    );
  }

  @action
  private setUrl(url: string) {
    this.url = url;
  }
}
