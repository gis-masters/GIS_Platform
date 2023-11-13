import React, { FC, ReactNode } from 'react';
import { Select, MenuItem, SelectProps as BaseSelectProps } from '@mui/material';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./TileSelect.scss';

const cnTileSelect = cn('TileSelect');

interface TileSelectProps extends BaseSelectProps {
  label?: string;
  options: TileOption[];
  dropdownColumns?: number;
}

interface TileOption {
  tile: ReactNode;
  value: string | number;
}

export const TileSelect: FC<TileSelectProps> = ({
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
        className: cnTileSelect('Dropdown', [MenuProps?.MenuListProps?.className]),
        style: { '--TileSelectDropdownColumns': dropdownColumns, ...MenuProps?.MenuListProps?.style },
        ...MenuProps?.MenuListProps
      },
      ...MenuProps
    }}
    variant={variant}
    className={cnTileSelect(null, [className])}
  >
    {options.map((item, i) => {
      return (
        <MenuItem key={i} value={item.value} className={cnTileSelect('Tile')}>
          {item.tile}
        </MenuItem>
      );
    })}
  </Select>
);
