import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { MenuItem, TextField } from '@mui/material';

import '!style-loader!css-loader!sass-loader!./XTable-PageSize.scss';

const cnXTablePageSize = cn('XTable', 'PageSize');

interface XTablePageSizeProps {
  pageSize: number;
  onChange(e: React.ChangeEvent<HTMLInputElement>): void;
}

const sizes = [5, 10, 20, 50, 100];

export const XTablePageSize: FC<XTablePageSizeProps> = ({ pageSize, onChange }) => (
  <TextField
    className={cnXTablePageSize()}
    label='На&nbsp;странице'
    value={String(pageSize)}
    select
    fullWidth
    onChange={onChange}
    variant='standard'
  >
    {sizes.map(size => (
      <MenuItem value={size} key={size}>
        {size}
      </MenuItem>
    ))}
  </TextField>
);
