import React, { Component } from 'react';
import { SelectChangeEvent } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { customStyleMarks, PointRule } from '../../../services/geoserver/styles/styles.models';
import { TiledSelect } from '../../TiledSelect/TiledSelect';
import { CustomStyleControlLabel } from '../Label/CustomStyleControl-Label';
import { CustomStyleControlMarkTile } from '../MarkTile/CustomStyleControl-MarkTile';
import { CustomStyleControlSubControl } from '../SubControl/CustomStyleControl-SubControl';

const cnCustomStyleControlMarkSelect = cn('CustomStyleControl', 'MarkSelect');

interface CustomStyleControlMarkSelectProps {
  label?: string;
  color: string;
  value: Pick<PointRule, 'markSize' | 'markType'>;
  onChange(value: Pick<PointRule, 'markSize' | 'markType'>): void;
}

export class CustomStyleControlMarkSelect extends Component<CustomStyleControlMarkSelectProps> {
  render() {
    const { value, label, color } = this.props;

    const markIndex = customStyleMarks.findIndex(
      mark => mark?.markSize === value?.markSize && mark?.markType === value?.markType
    );

    return (
      <CustomStyleControlSubControl className={cnCustomStyleControlMarkSelect()}>
        {label && <CustomStyleControlLabel>{label}</CustomStyleControlLabel>}
        <TiledSelect
          value={markIndex}
          dropdownColumns={4}
          options={customStyleMarks.map((mark, i) => ({
            tile: <CustomStyleControlMarkTile size={mark.markSize} type={mark.markType} color={color} />,
            value: i
          }))}
          onChange={this.handleChange}
        />
      </CustomStyleControlSubControl>
    );
  }

  @boundMethod
  private handleChange(e: SelectChangeEvent<unknown>) {
    const { onChange } = this.props;

    if (typeof e.target.value !== 'number') {
      throw new TypeError('Ошибка при выборе маркера');
    }

    onChange(customStyleMarks[e.target.value]);
  }
}
