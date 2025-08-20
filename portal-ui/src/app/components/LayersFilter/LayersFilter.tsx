import React, { FC, useCallback } from 'react';
import { observer } from 'mobx-react';
import { TextField, Tooltip } from '@mui/material';
import { Close, FilterAltOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { currentProject } from '../../stores/CurrentProject.store';
import { IconButton } from '../IconButton/IconButton';

import '!style-loader!css-loader!sass-loader!./LayersFilter.scss';

interface LayersFilterProps {
  turnOffLayersFilter(): void;
}

const cnLayersFilter = cn('LayersFilter');

export const LayersFilter: FC<LayersFilterProps> = observer(({ turnOffLayersFilter }) => {
  const handleFilterChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    currentProject.setFilter(e.target.value);
  }, []);

  return (
    <div className={cnLayersFilter()}>
      <TextField
        className={cnLayersFilter('Input')}
        value={currentProject.filter}
        onChange={handleFilterChange}
        placeholder='Фильтрация'
        autoFocus
        InputProps={{
          startAdornment: <FilterAltOutlined className={cnLayersFilter('InputIcon')} />,
          endAdornment: (
            <Tooltip title={'Отменить фильтрацию'}>
              <IconButton className={cnLayersFilter('Close')} onClick={turnOffLayersFilter} size='small'>
                <Close />
              </IconButton>
            </Tooltip>
          )
        }}
        variant='standard'
      />
    </div>
  );
});
