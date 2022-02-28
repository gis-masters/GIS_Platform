import React, { Component } from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { Tooltip } from '@mui/material';
import { saveAs } from 'file-saver';
import { boundMethod } from 'autobind-decorator';

import { getFileDownloadUrl } from '../../../services/server-urls.service';
import { getReadableFileSize } from '../../../services/files.util';
import { FileInfo } from '../../../services/files.service';
import { Link } from '../../Link/Link';

import { FilesExt } from '../Ext/Files-Ext';
import { FilesBaseName } from '../BaseName/Files-BaseName';

import '!style-loader!css-loader!sass-loader!./Files-Name.scss';
import '!style-loader!css-loader!sass-loader!../NameLink/Files-NameLink.scss';

const cnFilesName = cn('Files', 'Name');
const cnFilesNameLink = cn('Files', 'NameLink');

interface FilesNameProps {
  item: FileInfo;
  baseName: string;
  ext: string;
  disabled: boolean;
  file: File | undefined;
  numerous: boolean;
}

@observer
export class FilesName extends Component<FilesNameProps> {
  @observable private url = '';

  async componentDidMount() {
    this.setUrl(await getFileDownloadUrl(this.props.item.id));
  }

  render() {
    const { item, baseName, ext, disabled, numerous } = this.props;

    return (
      <Tooltip
        title={
          <>
            Скачать <b>{item.title}</b> ({getReadableFileSize(item.size)})
          </>
        }
        enterDelay={800}
      >
        <span className={cnFilesName({ numerous })}>
          <Link
            className={cnFilesNameLink()}
            disabled={disabled}
            href={this.url}
            download={item.title}
            onClick={this.clickHandler}
          >
            <FilesBaseName>{baseName}</FilesBaseName>
            {ext && <FilesExt>.{ext}</FilesExt>}
          </Link>
        </span>
      </Tooltip>
    );
  }

  @boundMethod
  private clickHandler(e: React.MouseEvent<HTMLAnchorElement>) {
    const { file, item } = this.props;

    if (file) {
      e.preventDefault();
      saveAs(file, item.title);
    }
  }

  @action
  private setUrl(url: string) {
    this.url = url;
  }
}
