import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { MenuItem, TextField } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { pageSizeVariants } from '../Explorer.models';
import { ExplorerStore } from '../Explorer.store';

import '!style-loader!css-loader!sass-loader!./Explorer-PageSize.scss';

const cnExplorerPageSize = cn('Explorer', 'PageSize');

interface ExplorerPageSizeProps {
  store: ExplorerStore;
  hidePageSize?: boolean;
  onChange(): void;
}

@observer
export class ExplorerPageSize extends Component<ExplorerPageSizeProps> {
  render() {
    const { store, hidePageSize } = this.props;
    const { pageSize } = store;

    return (
      !hidePageSize && (
        <div className={cnExplorerPageSize()}>
          <TextField
            label='На&nbsp;странице'
            value={pageSize}
            select
            fullWidth
            onChange={this.handleChange}
            variant='standard'
          >
            {pageSizeVariants.map(size => (
              <MenuItem value={size} key={size}>
                {size}
              </MenuItem>
            ))}
          </TextField>
        </div>
      )
    );
  }

  @boundMethod
  private handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setSize(Number(e.target.value));
  }

  private setSize(size: number) {
    const { store, onChange } = this.props;
    store.setPageSize(size);
    localStorage.setItem(store.pageSizeStorageKey, String(size));
    onChange();
  }
}
