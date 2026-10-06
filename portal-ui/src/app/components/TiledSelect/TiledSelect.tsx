import React, { type CSSProperties, type FC, type ReactNode } from 'react';
import { type BaseSelectProps, MenuItem, Select } from '@mui/material';
import { cn } from '@bem-react/classname';

import './TiledSelect.scss';

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
}) => {
  const listSlotProps = MenuProps?.slotProps?.list;
  const listProps = listSlotProps && typeof listSlotProps === 'object' ? listSlotProps : undefined;

  return (
    <Select
      {...props}
      MenuProps={{
        ...MenuProps,
        slotProps: {
          ...MenuProps?.slotProps,
          list: {
            ...listProps,
            className: cnTiledSelect('Dropdown', [listProps?.className]),
            style: {
              '--TiledSelectDropdownColumns': dropdownColumns,
              ...listProps?.style
            } as CSSProperties
          }
        }
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
};
