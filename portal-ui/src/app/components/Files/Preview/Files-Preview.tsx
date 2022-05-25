import React, { Component } from 'react';
import { ImageSearchOutlined } from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';
import { Tooltip } from '@mui/material';

import { IconButton } from '../../IconButton/IconButton';

const cnPreview = cn('Preview');

interface PreviewProps<T> {
  item: T;
  onPreview(item: T): void;
}

export class Preview<T> extends Component<PreviewProps<T>> {
  render() {
    return (
      <Tooltip title='Просмотр'>
        <IconButton className={cnPreview()} onClick={this.previewHandler} size='small'>
          <ImageSearchOutlined fontSize='small' />
        </IconButton>
      </Tooltip>
    );
  }

  @boundMethod
  private previewHandler() {
    const { item, onPreview } = this.props;
    onPreview(item);
  }
}
