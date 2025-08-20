import React, { Component } from 'react';
import { MenuItem, TextField } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import '!style-loader!css-loader!sass-loader!./XTable-PageSize.scss';

const cnXTablePageSize = cn('XTable', 'PageSize');

interface XTablePageSizeProps {
  pageSize: number;
  onChange(size: number): void;
}

export const pageSizes = [5, 10, 20, 50, 100];

export class XTablePageSize extends Component<XTablePageSizeProps> {
  render() {
    const { pageSize } = this.props;

    return (
      <TextField
        className={cnXTablePageSize()}
        label='На&nbsp;странице'
        value={String(pageSize)}
        select
        fullWidth
        onChange={this.handleChange}
        variant='standard'
      >
        {pageSizes.map(size => (
          <MenuItem value={size} key={size}>
            {size}
          </MenuItem>
        ))}
      </TextField>
    );
  }

  @boundMethod
  private handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { onChange } = this.props;
    onChange(Number(e.target.value));
  }
}
