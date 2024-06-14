import React, { Component } from 'react';
import { SelectChangeEvent } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { customStyleHatches, PolygonRule, transparent } from '../../../services/geoserver/styles/styles.models';
import { TiledSelect } from '../../TiledSelect/TiledSelect';
import { CustomStyleControlHatchingTile } from '../HatchingTile/CustomStyleControl-HatchingTile';
import { CustomStyleControlLabel } from '../Label/CustomStyleControl-Label';
import { CustomStyleControlSubControl } from '../SubControl/CustomStyleControl-SubControl';

const cnCustomStyleControlHatchingSelect = cn('CustomStyleControl', 'HatchingSelect');

interface CustomStyleControlHatchingSelectProps {
  label?: string;
  color: string;
  value: PolygonRule['fillGraphic'];
  onChange(value: PolygonRule['fillGraphic']): void;
}

export class CustomStyleControlHatchingSelect extends Component<CustomStyleControlHatchingSelectProps> {
  render() {
    const { value, label, color } = this.props;

    const hatchingIndex = customStyleHatches.findIndex(
      hatch =>
        hatch === value ||
        (hatch?.type === value?.type && hatch?.strokeWidth === value?.strokeWidth && hatch?.size === value?.size)
    );

    return (
      <CustomStyleControlSubControl className={cnCustomStyleControlHatchingSelect()}>
        {label && <CustomStyleControlLabel>{label}</CustomStyleControlLabel>}
        {color !== transparent && (
          <TiledSelect
            value={hatchingIndex}
            dropdownColumns={6}
            options={customStyleHatches.map((hatch, i) => ({
              tile: (
                <CustomStyleControlHatchingTile
                  color={color}
                  size={hatch?.size}
                  type={hatch?.type}
                  strokeWidth={hatch?.strokeWidth}
                />
              ),
              value: i
            }))}
            onChange={this.handleChange}
          />
        )}
      </CustomStyleControlSubControl>
    );
  }

  @boundMethod
  private handleChange(e: SelectChangeEvent<unknown>) {
    const { onChange } = this.props;

    if (typeof e.target.value !== 'number') {
      throw new TypeError('Ошибка при выборе штриховки');
    }

    onChange(customStyleHatches[e.target.value]);
  }
}
