import React, { Component } from 'react';
import { SelectChangeEvent } from '@mui/material';
import { boundMethod } from 'autobind-decorator';
import { IClassNameProps } from '@bem-react/core';
import { cn } from '@bem-react/classname';

import { TiledSelect } from '../../TiledSelect/TiledSelect';

import { CustomStyleControlColorTile } from '../ColorTile/CustomStyleControl-ColorTile';
import { CustomStyleControlLabel } from '../Label/CustomStyleControl-Label';
import { CustomStyleControlSubControl } from '../SubControl/CustomStyleControl-SubControl';

const cnCustomStyleControlColorSelect = cn('CustomStyleControl', 'ColorSelect');

interface CustomStyleControlColorSelectProps extends IClassNameProps {
  label?: string;
  value: string;
  colors: string[];
  onChange(value: string): void;
}

export class CustomStyleControlColorSelect extends Component<CustomStyleControlColorSelectProps> {
  render() {
    const { value, label, colors, className } = this.props;

    return (
      <CustomStyleControlSubControl className={cnCustomStyleControlColorSelect(null, [className])}>
        {label && <CustomStyleControlLabel>{label}</CustomStyleControlLabel>}
        <TiledSelect
          value={value}
          dropdownColumns={6}
          options={colors.map(color => ({
            tile: <CustomStyleControlColorTile color={color} />,
            value: color
          }))}
          onChange={this.changeHandler}
        />
      </CustomStyleControlSubControl>
    );
  }

  @boundMethod
  private changeHandler(e: SelectChangeEvent<unknown>) {
    if (typeof e.target.value !== 'string') {
      throw new TypeError('Ошибка при выборе цвета');
    }

    this.props.onChange(e.target.value);
  }
}
