import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { MenuItem, TextField } from '@mui/material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { SortOrderButton } from '../../SortOrderButton/SortOrderButton';
import { SortDir } from '../../../services/models';

import { ExplorerStore } from '../Explorer.store';

import '!style-loader!css-loader!sass-loader!./Explorer-Sort.scss';

const cnExplorerSort = cn('Explorer', 'Sort');

interface ExplorerSortProps {
  store: ExplorerStore;
  onChange: () => void;
}

@observer
export class ExplorerSort extends Component<ExplorerSortProps> {
  render() {
    const { store } = this.props;
    const { sortItems, sort, sortDir } = store;

    return sortItems?.length ? (
      <div className={cnExplorerSort()}>
        <TextField label='Сортировать&nbsp;по' value={sort} onChange={this.handleSortChange} select variant='standard'>
          {sortItems.map(({ label, value }, i) => (
            <MenuItem value={value} key={i}>
              {label}
            </MenuItem>
          ))}
        </TextField>
        <SortOrderButton asc={sortDir === SortDir.ASC} onClick={this.handleSortOrderClick} />
      </div>
    ) : null;
  }

  @boundMethod
  private handleSortChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { store, onChange } = this.props;
    store.setSort(e.target.value);
    onChange();
  }

  @boundMethod
  private handleSortOrderClick() {
    const { store, onChange } = this.props;
    store.setSortDir(store.sortDir === SortDir.ASC ? SortDir.DESC : SortDir.ASC);
    onChange();
  }
}
