import React, { FC, ReactNode } from 'react';
import { FormControl, Select as BaseSelect, InputLabel, MenuItem } from '@material-ui/core';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import '!style-loader!css-loader!sass-loader!./Select.scss';

const cnSelect = cn('Select');

type Value = string | number | string[];

interface Option {
  value: Value;
  children: ReactNode;
}

interface SelectProps extends IClassNameProps {
  id?: string;
  label?: string;
  options: Option[];
  value?: Value;
  onChange?: (e: React.ChangeEvent<{ name?: string; value: unknown }>) => void;
}

export const Select: FC<SelectProps> = ({ className, id, label, value, onChange, options }) => (
  <FormControl className={cnSelect(null, [className])}>
    {label ? <InputLabel>{label}</InputLabel> : null}
    <BaseSelect value={value} onChange={onChange} id={id}>
      {options.map((option, i) => (
        <MenuItem {...option} key={i} />
      ))}
    </BaseSelect>
  </FormControl>
);
