import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { SelectChangeEvent } from '@mui/material';
import { boundMethod } from 'autobind-decorator';
import { withBemMod } from '@bem-react/core';
import { isEqual } from 'lodash';

import {
  PolygonRule,
  customStyleFillColors,
  customStyleStrokeColors,
  customStyleStrokes
} from '../../../../services/geoserver/styles/styles.models';
import { TileSelect } from '../../../TileSelect/TileSelect';

import { CustomStyleControlFormProps, cnCustomStyleControlForm } from '../CustomStyleControl-Form.base';
import { CustomStyleControlStrokeTile } from '../../StrokeTile/CustomStyleControl-StrokeTile';
import { CustomStyleControlColorTile } from '../../ColorTile/CustomStyleControl-ColorTile';
import { CustomStyleControlLabel } from '../../Label/CustomStyleControl-Label';

@observer
class CustomStyleControlFormTypePolygon extends Component<CustomStyleControlFormProps> {
  private ruleTypeError = new Error('Неправильный тип стиля');

  render() {
    const { className, value } = this.props;

    if (value.type !== 'polygon') {
      throw this.ruleTypeError;
    }

    const currentStrokeIndex = customStyleStrokes.findIndex(
      ({ strokeWidth, strokeDashArray }) =>
        value.rule.strokeWidth === strokeWidth && isEqual(value.rule.strokeDashArray, strokeDashArray)
    );

    return (
      <div className={cnCustomStyleControlForm(null, [className])}>
        <CustomStyleControlLabel>цвет обводки</CustomStyleControlLabel>
        <TileSelect
          value={value.rule.strokeColor}
          options={customStyleStrokeColors.map(color => ({
            tile: <CustomStyleControlColorTile color={color} />,
            value: color
          }))}
          onChange={this.strokeColorChangeHandler}
        />

        <CustomStyleControlLabel>обводка</CustomStyleControlLabel>
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

        <CustomStyleControlLabel>цвет заливки</CustomStyleControlLabel>
        <TileSelect
          value={value.rule.fillColor}
          options={customStyleFillColors.map(color => ({
            tile: <CustomStyleControlColorTile color={color} />,
            value: color
          }))}
          onChange={this.fillColorChangeHandler}
        />
      </div>
    );
  }

  @boundMethod
  private onDashChange(e: SelectChangeEvent<unknown>) {
    const { onChange, value } = this.props;

    if (value.type !== 'polygon' || typeof e.target.value !== 'number') {
      throw this.ruleTypeError;
    }

    if (typeof e.target.value !== 'number') {
      throw new TypeError('Ошибка при выборе линии');
    }

    const stroke = customStyleStrokes[e.target.value];
    const rule: PolygonRule = {
      ...value.rule,
      strokeDashArray: stroke.strokeDashArray,
      strokeWidth: stroke.strokeWidth
    };

    onChange({ ...value, rule });
  }

  @boundMethod
  private strokeColorChangeHandler(e: SelectChangeEvent<unknown>) {
    this.colorChange('strokeColor', e.target.value);
  }

  @boundMethod
  private fillColorChangeHandler(e: SelectChangeEvent<unknown>) {
    this.colorChange('fillColor', e.target.value);
  }

  private colorChange(property: 'fillColor' | 'strokeColor', color: unknown) {
    const { onChange, value } = this.props;

    if (value.type !== 'polygon') {
      throw this.ruleTypeError;
    }

    if (typeof color !== 'string') {
      throw new TypeError('Ошибка при выборе цвета');
    }

    const rule: PolygonRule = {
      ...value.rule,
      [property]: color
    };

    onChange({ ...value, rule });
  }
}

export const withTypePolygon = withBemMod<CustomStyleControlFormProps, CustomStyleControlFormProps>(
  cnCustomStyleControlForm(),
  { type: 'polygon' },
  () => CustomStyleControlFormTypePolygon
);
