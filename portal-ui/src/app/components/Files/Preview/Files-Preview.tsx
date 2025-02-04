import React, { Component } from 'react';
import { Tooltip } from '@mui/material';
import { ImageSearchOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { IconButton } from '../../IconButton/IconButton';

const cnFilesPreview = cn('Files', 'Preview');

interface PreviewProps<T> {
  item: T;
  onPreview(item: T): void;
}

export class FilesPreview<T> extends Component<PreviewProps<T>> {
  render() {
    return (
      <Tooltip title='Просмотр'>
        <IconButton className={cnFilesPreview()} onClick={this.handlePreview} size='small'>
          <ImageSearchOutlined fontSize='small' />
        </IconButton>
      </Tooltip>
    );
  }

  @boundMethod
  private handlePreview() {
    const { item, onPreview } = this.props;
    onPreview(item);
  }
}
