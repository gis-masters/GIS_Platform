import React, { type FC } from 'react';
import {
  type BaseSelectProps,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select as BaseSelect
} from '@mui/material';
import { cn } from '@bem-react/classname';
import { type IClassNameProps } from '@bem-react/core';

import { type PropertyOption } from '../../services/data/schema/schema.models';

import './Select.scss';

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
