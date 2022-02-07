import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { TextField } from '@mui/material';
import { boundMethod } from 'autobind-decorator';

import { getChildrenFilterField, getChildrenFilterLabel } from '../Adapter/Explorer-Adapter';
import { ExplorerStore } from '../Explorer.store';

const cnExplorerFilter = cn('Explorer', 'Filter');

interface ExplorerFilterProps {
  store: ExplorerStore;
  onChange: () => void;
}

@observer
export class ExplorerFilter extends Component<ExplorerFilterProps> {
  render() {
    const { filter, openedItem } = this.props.store;
    const filterField = getChildrenFilterField(openedItem) || null;

    return (
      filterField && (
        <TextField
          className={cnExplorerFilter()}
          label={getChildrenFilterLabel(openedItem) || 'Поиск'}
          value={filter[filterField] || ''}
          onChange={this.handleFilterChange}
          InputProps={{
            startAdornment: ' '
          }}
          variant='standard'
        />
      )
    );
  }

  @boundMethod
  private handleFilterChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { store, onChange } = this.props;
    const { openedItem } = store;
    const filterField = getChildrenFilterField(openedItem);
    store.setFilter({ [filterField]: e.target.value });
    onChange();
  }
}
