import React, { Component } from 'react';
import { DeleteOutline } from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';
import { Tooltip } from '@mui/material';

import { IconButton } from '../../IconButton/IconButton';

const cnLookupDelete = cn('Lookup', 'Delete');

interface LookupDeleteProps<T> {
  item: T;
  onDelete(item: T): void;
}

export class LookupDelete<T> extends Component<LookupDeleteProps<T>> {
  render() {
    return (
      <Tooltip title='Удалить'>
        <IconButton className={cnLookupDelete()} onClick={this.deleteHandler} size='small'>
          <DeleteOutline fontSize='small' />
        </IconButton>
      </Tooltip>
    );
  }

  @boundMethod
  private deleteHandler() {
    const { item, onDelete } = this.props;
    onDelete(item);
  }
}
