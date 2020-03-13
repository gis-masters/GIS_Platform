import React from 'react';
import { FormControl, Select as BaseSelect, InputLabel, MenuItem } from '@material-ui/core'
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import '!style-loader!css-loader!sass-loader!./Select.scss';

const cnSelect = cn('Select');

type Value = string | number | string[];

interface Option {
  value: Value;
  children: React.ReactNode;
}

interface SelectProps extends IClassNameProps {
  label?: string;
  options: Option[];
  value?: Value;
  onChange?: (e: React.ChangeEvent<{ name?: string; value: unknown }>) => void;
}

export const Select: React.FC<SelectProps> = ({ className, label, value, onChange, options }) => (
  <FormControl className={cnSelect(null, [className])}>
    {label ? <InputLabel>{label}</InputLabel> : null}
    <BaseSelect value={value} onChange={onChange}>
      {options.map((option, i) => <MenuItem {...option} key={i} />)}
    </BaseSelect>
  </FormControl>
);
