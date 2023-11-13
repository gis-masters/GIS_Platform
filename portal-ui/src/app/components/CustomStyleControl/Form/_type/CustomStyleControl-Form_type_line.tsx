import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { SelectChangeEvent } from '@mui/material';
import { boundMethod } from 'autobind-decorator';
import { withBemMod } from '@bem-react/core';
import { isEqual } from 'lodash';

import {
  LineRule,
  customStyleStrokeColors,
  customStyleStrokes
} from '../../../../services/geoserver/styles/styles.models';
import { TileSelect } from '../../../TileSelect/TileSelect';

import { CustomStyleControlFormProps, cnCustomStyleControlForm } from '../CustomStyleControl-Form.base';
import { CustomStyleControlStrokeTile } from '../../StrokeTile/CustomStyleControl-StrokeTile';
import { CustomStyleControlColorTile } from '../../ColorTile/CustomStyleControl-ColorTile';
import { CustomStyleControlLabel } from '../../Label/CustomStyleControl-Label';

@observer
class CustomStyleControlFormTypeLine extends Component<CustomStyleControlFormProps> {
  private ruleTypeError = new Error('Неправильный тип стиля');

  render() {
    const { className, value } = this.props;

    if (value.type !== 'line') {
      throw this.ruleTypeError;
    }

    const currentStrokeIndex = customStyleStrokes.findIndex(
      ({ strokeWidth, strokeDashArray }) =>
        value.rule.strokeWidth === strokeWidth && isEqual(value.rule.strokeDashArray, strokeDashArray)
    );

    return (
      <div className={cnCustomStyleControlForm(null, [className])}>
        <CustomStyleControlLabel>цвет</CustomStyleControlLabel>
        <TileSelect
          value={value.rule.strokeColor}
          options={customStyleStrokeColors.map(color => ({
            tile: <CustomStyleControlColorTile color={color} />,
            value: color
          }))}
          onChange={this.onStrokeColorChange}
        />

        <CustomStyleControlLabel>линия</CustomStyleControlLabel>
        <TileSelect
          value={currentStrokeIndex}
          options={customStyleStrokes.map((stroke, i) => ({
            tile: (
              <CustomStyleControlStrokeTile strokeWidth={stroke.strokeWidth} strokeDasharray={stroke.strokeDashArray} />
            ),
            value: i
          }))}
          onChange={this.onDashChange}
        />
      </div>
    );
  }

  @boundMethod
  private onDashChange(e: SelectChangeEvent<unknown>) {
    const { onChange, value } = this.props;

    if (value.type !== 'line') {
      throw this.ruleTypeError;
    }

    if (typeof e.target.value !== 'number') {
      throw new TypeError('Ошибка при выборе линии');
    }

    const stroke = customStyleStrokes[e.target.value];
    const rule: LineRule = {
      ...value.rule,
      strokeDashArray: stroke.strokeDashArray,
      strokeWidth: stroke.strokeWidth
    };

    onChange({ ...value, rule });
  }

  @boundMethod
  private onStrokeColorChange(e: SelectChangeEvent<unknown>) {
    const { onChange, value } = this.props;

    if (value.type !== 'line') {
      throw this.ruleTypeError;
    }

    if (typeof e.target.value !== 'string') {
      throw new TypeError('Ошибка при выборе цвета');
    }

    const rule: LineRule = {
      ...value.rule,
      strokeColor: e.target.value
    };

    onChange({ ...value, rule });
  }
}

export const withTypeLine = withBemMod<CustomStyleControlFormProps, CustomStyleControlFormProps>(
  cnCustomStyleControlForm(),
  { type: 'line' },
  () => CustomStyleControlFormTypeLine
);
