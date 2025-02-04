import React, { Component } from 'react';
import { SelectChangeEvent } from '@mui/material';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';

import { TiledSelect } from '../../TiledSelect/TiledSelect';
import { CustomStyleControlColorTile } from '../ColorTile/CustomStyleControl-ColorTile';
import { CustomStyleControlLabel } from '../Label/CustomStyleControl-Label';
import { CustomStyleControlSubControl } from '../SubControl/CustomStyleControl-SubControl';

import '!style-loader!css-loader!sass-loader!../MenuList/CustomStyleControl-MenuList.scss';

const cnCustomStyleControl = cn('CustomStyleControl');

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
      <CustomStyleControlSubControl className={cnCustomStyleControl('ColorSelect', [className])}>
        {label && <CustomStyleControlLabel>{label}</CustomStyleControlLabel>}
        <TiledSelect
          value={value}
          MenuProps={{
            MenuListProps: {
              className: cnCustomStyleControl('MenuList')
            }
          }}
          dropdownColumns={6}
          options={colors.map(color => ({
            tile: <CustomStyleControlColorTile color={color} />,
            value: color
          }))}
          onChange={this.handleChange}
        />
      </CustomStyleControlSubControl>
    );
  }

  @boundMethod
  private handleChange(e: SelectChangeEvent<unknown>) {
    if (typeof e.target.value !== 'string') {
      throw new TypeError('Ошибка при выборе цвета');
    }

    this.props.onChange(e.target.value);
  }
}
