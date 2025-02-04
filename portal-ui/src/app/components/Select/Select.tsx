import React, { FC } from 'react';
import { BaseSelectProps, FormControl, InputLabel, ListItemText, MenuItem, Select as BaseSelect } from '@mui/material';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import { PropertyOption } from '../../services/data/schema/schema.models';

import '!style-loader!css-loader!sass-loader!./Select.scss';

const cnSelect = cn('Select');

interface SelectProps extends IClassNameProps, BaseSelectProps {
  label?: string;
  options: PropertyOption[];
}

export const Select: FC<SelectProps> = ({ className, label, options, variant = 'standard', ...props }) => (
  <FormControl className={cnSelect(null, [className])}>
    {label ? <InputLabel>{label}</InputLabel> : null}
    <BaseSelect {...props} variant={variant}>
      {options.map((item, i) => {
        return (
          <MenuItem key={i} value={item.value}>
            <ListItemText>{item.title}</ListItemText>
            {item.endIcon}
          </MenuItem>
        );
      })}
    </BaseSelect>
  </FormControl>
);
