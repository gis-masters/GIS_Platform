import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { MenuItem, Paper as div, TextField } from '@material-ui/core';

import { SortDir } from '../../../services/models';
import { ExplorerStore } from '../Explorer.store';
import { SortOrderButton } from '../../SortOrderButton/SortOrderButton';
import { ExplorerToolbarActions } from '../ToolbarActions/Explorer-ToolbarActions';
import { getChildrenFilterField, getChildrenFilterLabel, getToolbarActions } from '../Adapter/Explorer-Adapter';

import '!style-loader!css-loader!sass-loader!./Explorer-Toolbar.scss';

const cnExplorerToolbar = cn('Explorer', 'Toolbar');

interface ExplorerToolbarProps {
  store: ExplorerStore;
  onChange: () => void;
}

@observer
export class ExplorerToolbar extends Component<ExplorerToolbarProps> {
  render() {
    const { sortItems, sort, sortDir, filter, currentItem, path } = this.props.store;
    const filterField = getChildrenFilterField(currentItem);
    const toolbarActions = path.length > 1 ? getToolbarActions(path[path.length - 2]) : null;

    return (
      <div className={cnExplorerToolbar()}>
        {filterField && (
          <TextField
            label={getChildrenFilterLabel(currentItem) || 'Поиск'}
            value={filter[filterField] || ''}
            onChange={this.handleFilterChange}
            InputProps={{
              startAdornment: ' '
            }}
          />
        )}

        {Boolean(sortItems?.length) && (
          <>
            <TextField label='Сортировать&nbsp;по' value={sort} onChange={this.handleSortChange} select>
              {sortItems.map(({ label, value }, i) => (
                <MenuItem value={value} key={i}>
                  {label}
                </MenuItem>
              ))}
            </TextField>

            <SortOrderButton asc={sortDir === SortDir.ASC} onClick={this.handleSortOrderClick} />
          </>
        )}

        {toolbarActions && <ExplorerToolbarActions>{toolbarActions}</ExplorerToolbarActions>}
      </div>
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
