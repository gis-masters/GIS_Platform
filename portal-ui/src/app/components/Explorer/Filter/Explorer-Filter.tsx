import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { TextField } from '@mui/material';
import { FilterAltOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { IconButton } from '../../IconButton/IconButton';
import { getChildrenFilterField, getChildrenFilterLabel } from '../Adapter/Explorer-Adapter';
import { ExplorerService } from '../Explorer.service';
import { ExplorerStore } from '../Explorer.store';

import '!style-loader!css-loader!sass-loader!./Explorer-Filter.scss';

const cnExplorerFilter = cn('Explorer', 'Filter');

interface ExplorerFilterProps {
  store: ExplorerStore;
  service: ExplorerService;
  onChange(): void;
}

@observer
export class ExplorerFilter extends Component<ExplorerFilterProps> {
  render() {
    const { filter, openedItem } = this.props.store;
    const filterField = getChildrenFilterField(openedItem, this.props.store) || null;
    let clearedValue: string = filterField ? filter[filterField] : '';

    if (clearedValue) {
      clearedValue = clearedValue.replaceAll("''", "'");
    }

    return (
      filterField && (
        <div className={cnExplorerFilter()}>
          <TextField
            label={getChildrenFilterLabel(openedItem, this.props.store) || 'Поиск'}
            value={clearedValue || ''}
            onChange={this.handleFilterChange}
            InputProps={{
              endAdornment: (
                <IconButton size='small'>
                  <FilterAltOutlined />
                </IconButton>
              )
            }}
            variant='standard'
          />
        </div>
      )
    );
  }

  @boundMethod
  private handleFilterChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { store, service, onChange } = this.props;
    const { openedItem } = store;
    const filterField = getChildrenFilterField(openedItem, store);

    if (filterField) {
      store.setFilter({ [filterField]: e.target.value.replaceAll("'", "''") });
    }

    onChange();
    service.paginate(0);
  }
}
