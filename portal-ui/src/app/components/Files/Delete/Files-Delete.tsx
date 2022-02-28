import React, { Component } from 'react';
import {} from 'mobx';
import { observer } from 'mobx-react';
import { DeleteOutline } from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { IconButton } from '../../IconButton/IconButton';
import { FileInfo } from '../../../services/files.service';

import '!style-loader!css-loader!sass-loader!./Files-Delete.scss';

const cnFilesDelete = cn('Files', 'Delete');

interface FilesDeleteProps {
  item: FileInfo;
  onDelete(item: FileInfo): void;
}

@observer
export class FilesDelete extends Component<FilesDeleteProps> {
  render() {
    return (
      <IconButton className={cnFilesDelete()} onClick={this.deleteHandler} size='small'>
        <DeleteOutline fontSize='small' />
      </IconButton>
    );
  }

  @boundMethod
  private deleteHandler() {
    const { item, onDelete } = this.props;
    onDelete(item);
  }
}
