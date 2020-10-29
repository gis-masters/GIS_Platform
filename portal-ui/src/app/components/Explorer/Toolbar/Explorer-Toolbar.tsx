import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { MenuItem, Paper, TextField } from '@material-ui/core';
import { boundMethod } from 'autobind-decorator';

import { SortDir } from '../../../services/models';
import { SortOrderButton } from '../../SortOrderButton/SortOrderButton';

import { ExplorerStore } from '../Explorer.store';
import { getChildrenFilterField, getChildrenFilterLabel } from '../Adapter/Explorer-Adapter';

import '!style-loader!css-loader!sass-loader!./Explorer-Toolbar.scss';

const cnExplorerToolbar = cn('Explorer', 'Toolbar');

interface ExplorerToolbarProps {
  store: ExplorerStore;
  onChange: () => void;
}

@observer
export class ExplorerToolbar extends Component<ExplorerToolbarProps> {
  render() {
    const { sortItems, sort, sortDir, filter, currentItem } = this.props.store;
    const filterField = getChildrenFilterField(currentItem);

    return (
      <Paper className={cnExplorerToolbar()} square>
        {filterField && (
          <TextField
            label={getChildrenFilterLabel(currentItem) || 'Поиск'}
            value={filter[filterField] || ''}
            fullWidth
            onChange={this.handleFilterChange}
            InputProps={{
              startAdornment: ' '
            }}
          />
        )}

        <TextField label='Сортировать по' value={sort} onChange={this.handleSortChange} fullWidth select>
          {sortItems.map(({ label, value }, i) => (
            <MenuItem value={value} key={i}>
              {label}
            </MenuItem>
          ))}
        </TextField>

        <SortOrderButton asc={sortDir === SortDir.ASC} onClick={this.handleSortOrderClick} />
      </Paper>
    );
  }

  @boundMethod
  private handleFilterChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { store, onChange } = this.props;
    const { currentItem } = store;
    const filterField = getChildrenFilterField(currentItem);
    store.setFilter({ [filterField]: e.target.value });
    onChange();
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
