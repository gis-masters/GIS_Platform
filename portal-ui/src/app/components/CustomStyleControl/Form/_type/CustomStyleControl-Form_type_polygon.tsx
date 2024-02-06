import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { boundMethod } from 'autobind-decorator';
import { withBemMod } from '@bem-react/core';

import {
  LineRule,
  PolygonRule,
  customStyleFillColors,
  customStyleStrokeColors
} from '../../../../services/geoserver/styles/styles.models';
import { Shape } from '../../../Icons/Shape';

import { CustomStyleControlHatchingSelect } from '../../HatchingSelect/CustomStyleControl-HatchingSelect';
import { CustomStyleControlFormProps, cnCustomStyleControlForm } from '../CustomStyleControl-Form.base';
import { CustomStyleControlStrokeSelect } from '../../StrokeSelect/CustomStyleControl-StrokeSelect';
import { CustomStyleControlColorSelect } from '../../ColorSelect/CustomStyleControl-ColorSelect';

@observer
export class CustomStyleControlFormTypePolygon extends Component<CustomStyleControlFormProps> {
  private ruleTypeError = new Error('Неправильный тип стиля');

  render() {
    const { className, value, withIcon } = this.props;

    if (value.type !== 'polygon') {
      throw this.ruleTypeError;
    }

    return (
      <div className={cnCustomStyleControlForm(null, [className])}>
        {withIcon && <Shape color='primary' />}

        <CustomStyleControlStrokeSelect
          label='обводка'
          color={value.rule.strokeColor}
          value={{ strokeWidth: value.rule.strokeWidth, strokeDashArray: value.rule.strokeDashArray }}
          onChange={this.strokeChangeHandler}
        />

        <CustomStyleControlColorSelect
          colors={customStyleStrokeColors}
          value={value.rule.strokeColor}
          onChange={this.strokeColorChangeHandler}
        />

        <CustomStyleControlHatchingSelect
          label='заливка'
          color={value.rule.fillColor}
          value={value.rule.fillGraphic}
          onChange={this.fillGraphicChangeHandler}
        />

        <CustomStyleControlColorSelect
          colors={customStyleFillColors}
          value={value.rule.fillColor}
          onChange={this.fillColorChangeHandler}
        />
      </div>
    );
  }

  @boundMethod
  private strokeChangeHandler(stroke: Pick<LineRule, 'strokeWidth' | 'strokeDashArray'>) {
    const { onChange, value } = this.props;

    if (value.type !== 'polygon') {
      throw this.ruleTypeError;
    }

    const rule: PolygonRule = {
      ...value.rule,
      strokeDashArray: stroke.strokeDashArray,
      strokeWidth: stroke.strokeWidth
    };

    onChange({ ...value, rule });
  }

  @boundMethod
  private strokeColorChangeHandler(color: string) {
    this.colorChange('strokeColor', color);
  }

  @boundMethod
  private fillColorChangeHandler(color: string) {
    this.colorChange('fillColor', color);
  }

  private colorChange(property: 'fillColor' | 'strokeColor', color: string) {
    const { onChange, value } = this.props;

    if (value.type !== 'polygon') {
      throw this.ruleTypeError;
    }

    const rule: PolygonRule = {
      ...value.rule,
      [property]: color
    };

    onChange({ ...value, rule });
  }

  @boundMethod
  private fillGraphicChangeHandler(graphic: PolygonRule['fillGraphic']) {
    const { onChange, value } = this.props;

    if (value.type !== 'polygon') {
      throw this.ruleTypeError;
    }

    const rule: PolygonRule = {
      ...value.rule,
      fillGraphic: graphic
    };

    onChange({ ...value, rule });
  }
}

export const withTypePolygon = withBemMod<CustomStyleControlFormProps, CustomStyleControlFormProps>(
  cnCustomStyleControlForm(),
  { type: 'polygon' },
  () => CustomStyleControlFormTypePolygon
);
