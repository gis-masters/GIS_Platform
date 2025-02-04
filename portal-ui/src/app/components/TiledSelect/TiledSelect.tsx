import React, { FC, ReactNode } from 'react';
import { BaseSelectProps, MenuItem, Select } from '@mui/material';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./TiledSelect.scss';

const cnTiledSelect = cn('TiledSelect');

interface TileOption {
  tile: ReactNode;
  value: string | number;
}

interface TiledSelectProps extends BaseSelectProps {
  label?: string;
  options: TileOption[];
  dropdownColumns?: number;
}

export const TiledSelect: FC<TiledSelectProps> = ({
  className,
  options,
  variant = 'standard',
  dropdownColumns = 4,
  MenuProps,
  ...props
}) => (
  <Select
    {...props}
    MenuProps={{
      MenuListProps: {
        className: cnTiledSelect('Dropdown', [MenuProps?.MenuListProps?.className]),
        style: { '--TiledSelectDropdownColumns': dropdownColumns, ...MenuProps?.MenuListProps?.style },
        ...MenuProps?.MenuListProps
      },
      ...MenuProps
    }}
    variant={variant}
    className={cnTiledSelect(null, [className])}
  >
    {options.map((item, i) => {
      return (
        <MenuItem key={i} value={item.value} className={cnTiledSelect('Tile')}>
          {item.tile}
        </MenuItem>
      );
    })}
  </Select>
);
