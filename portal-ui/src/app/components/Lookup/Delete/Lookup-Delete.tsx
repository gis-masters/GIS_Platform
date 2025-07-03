import React, { Component } from 'react';
import { Tooltip } from '@mui/material';
import { DeleteOutline } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { IconButton } from '../../IconButton/IconButton';

const cnLookupDelete = cn('Lookup', 'Delete');

interface LookupDeleteProps<T> {
  item: T;
  tooltip?: string;
  onDelete(item: T): void;
}

export class LookupDelete<T> extends Component<LookupDeleteProps<T>> {
  render() {
    return (
      <Tooltip title={this.props.tooltip || 'Удалить'}>
        <span>
          <IconButton className={cnLookupDelete()} onClick={this.handleDelete} size='small' color='error'>
            <DeleteOutline fontSize='small' />
          </IconButton>
        </span>
      </Tooltip>
    );
  }

  @boundMethod
  private handleDelete() {
    const { item, onDelete } = this.props;
    onDelete(item);
  }
}
