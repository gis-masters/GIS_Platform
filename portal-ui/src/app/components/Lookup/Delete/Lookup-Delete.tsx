import React, { Component } from 'react';
import { DeleteOutline } from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { IconButton } from '../../IconButton/IconButton';

const cnLookupDelete = cn('Lookup', 'Delete');

interface LookupDeleteProps<T> {
  item: T;
  onDelete(item: T): void;
}

export class LookupDelete<T> extends Component<LookupDeleteProps<T>> {
  render() {
    return (
      <IconButton className={cnLookupDelete()} onClick={this.deleteHandler} size='small'>
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
