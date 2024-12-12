import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { saveAs } from 'file-saver';

import { filesClient } from '../../../services/data/files/files.client';
import { compoundFileFullType, FileInfo } from '../../../services/data/files/files.models';
import { getFileExtension, getReadableFileSize } from '../../../services/data/files/files.util';
import { organizationSettings } from '../../../stores/OrganizationSettings.store';
import { Link } from '../../Link/Link';
import { LookupName } from '../../Lookup/Name/Lookup-Name';
import { LookupStatusType } from '../../Lookup/Status/Lookup-Status';
import { FilesBaseName } from '../BaseName/Files-BaseName';
import { FilesExt } from '../Ext/Files-Ext';

import '!style-loader!css-loader!sass-loader!../NameLink/Files-NameLink.scss';

const cnFilesName = cn('Files', 'Name');
const cnFilesNameLink = cn('Files', 'NameLink');

interface FilesNameProps {
  item: FileInfo;
  baseName: string;
  ext: string;
  disabled?: boolean;
  status: LookupStatusType | undefined;
  file: File | undefined;
  numerous: boolean;
  mainCompletedCompoundFile?: boolean;
}

@observer
export class FilesName extends Component<FilesNameProps> {
  render() {
    const { item, baseName, ext, mainCompletedCompoundFile, status, numerous } = this.props;
    const disabled = status ? ['loading', 'new', 'error', 'notAvailable'].includes(status) : undefined;

    return (
      <Tooltip
        title={
          (mainCompletedCompoundFile && (
            <>Набор связанных файлов {compoundFileFullType[getFileExtension(item.title)]}</>
          )) ||
          (status === 'notAvailable' && <>Отсутствует обязательный файл для публикации набора связных файлов</>) || (
            <>
              Скачать <b>{item.title}</b> ({getReadableFileSize(item.size)})
            </>
          ) ||
          (disabled && <>Невозможно скачать файл</>)
        }
        enterDelay={800}
      >
        <LookupName numerous={numerous} className={cnFilesName()}>
          <Link
            className={cnFilesNameLink({ main: mainCompletedCompoundFile })}
            disabled={disabled || !organizationSettings.downloadFiles}
            href={filesClient.getFileDownloadUrl(item.id)}
            download={item.title}
            onClick={this.handleClick}
          >
            <FilesBaseName>{baseName}</FilesBaseName>
            {ext && <FilesExt>.{ext}</FilesExt>}
          </Link>
        </LookupName>
      </Tooltip>
    );
  }

  @boundMethod
  private handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    const { file, item } = this.props;

    // файл существует только у свежесозданных файлов, не загруженных на бэк
    if (file) {
      e.preventDefault();
      saveAs(file, item.title);
    }
  }
}
