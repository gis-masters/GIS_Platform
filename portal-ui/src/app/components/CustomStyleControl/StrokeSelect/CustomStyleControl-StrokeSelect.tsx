import React, { Component } from 'react';
import { SelectChangeEvent } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { isEqual } from 'lodash';

import { customStyleStrokes, LineRule } from '../../../services/geoserver/styles/styles.models';
import { TiledSelect } from '../../TiledSelect/TiledSelect';
import { CustomStyleControlLabel } from '../Label/CustomStyleControl-Label';
import { CustomStyleControlStrokeTile } from '../StrokeTile/CustomStyleControl-StrokeTile';
import { CustomStyleControlSubControl } from '../SubControl/CustomStyleControl-SubControl';

const cnCustomStyleControlStrokeSelect = cn('CustomStyleControl', 'StrokeSelect');

interface CustomStyleControlStrokeSelectProps {
  label: string;
  color: string;
  value: Pick<LineRule, 'strokeWidth' | 'strokeDashArray'>;
  onChange(value: Pick<LineRule, 'strokeWidth' | 'strokeDashArray'>): void;
}

export class CustomStyleControlStrokeSelect extends Component<CustomStyleControlStrokeSelectProps> {
  render() {
    const { value, label, color } = this.props;
    const currentStrokeIndex = customStyleStrokes.findIndex(
      ({ strokeWidth, strokeDashArray }) =>
        value.strokeWidth === strokeWidth && isEqual(value.strokeDashArray, strokeDashArray)
    );

    return (
      <CustomStyleControlSubControl className={cnCustomStyleControlStrokeSelect()}>
        <CustomStyleControlLabel>{label}</CustomStyleControlLabel>
        <TiledSelect
          value={currentStrokeIndex}
          dropdownColumns={4}
          options={customStyleStrokes.map((stroke, i) => ({
            tile: (
              <CustomStyleControlStrokeTile
                strokeWidth={stroke.strokeWidth}
                strokeDasharray={stroke.strokeDashArray}
                color={color}
              />
            ),
            value: i
          }))}
          onChange={this.handleChange}
        />
      </CustomStyleControlSubControl>
    );
  }

  @boundMethod
  private handleChange(e: SelectChangeEvent<unknown>) {
    if (typeof e.target.value !== 'number') {
      throw new TypeError('Ошибка при выборе линии');
    }

    this.props.onChange(customStyleStrokes[e.target.value]);
  }
}
