import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withBemMod } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';

import { PropertySchema } from '../../../../services/data/schema/schema.models';
import {
  customStyleFillColors,
  customStyleStrokeColors,
  LineRule,
  PolygonRule
} from '../../../../services/geoserver/styles/styles.models';
import { Shape } from '../../../Icons/Shape';
import { CustomStyleControlColorSelect } from '../../ColorSelect/CustomStyleControl-ColorSelect';
import { cnCustomStyleControl } from '../../CustomStyleControl';
import { CustomStyleControlHatchingSelect } from '../../HatchingSelect/CustomStyleControl-HatchingSelect';
import { CustomStyleControlLabelPropertySelect } from '../../LabelPropertySelect/CustomStyleControl-LabelPropertySelect';
import { CustomStyleControlStrokeSelect } from '../../StrokeSelect/CustomStyleControl-StrokeSelect';
import { cnCustomStyleControlForm, CustomStyleControlFormProps } from '../CustomStyleControl-Form.base';

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

        <div className={cnCustomStyleControl('OptionsWrapper')}>
          <CustomStyleControlStrokeSelect
            label='обводка'
            color={value.rule.strokeColor}
            value={{ strokeWidth: value.rule.strokeWidth, strokeDashArray: value.rule.strokeDashArray }}
            onChange={this.handleStrokeChange}
          />

          <CustomStyleControlColorSelect
            colors={customStyleStrokeColors}
            value={value.rule.strokeColor}
            onChange={this.handleStrokeColorChange}
          />

          <CustomStyleControlHatchingSelect
            label='заливка'
            color={value.rule.fillColor}
            value={value.rule.fillGraphic}
            onChange={this.handleFillGraphicChange}
          />

          <CustomStyleControlColorSelect
            colors={customStyleFillColors}
            value={value.rule.fillColor}
            onChange={this.handleFillColorChange}
          />

          <CustomStyleControlLabelPropertySelect
            label='подпись'
            schema={this.props.schema}
            onChange={this.labelChange}
            labelProperty={value.rule.labelProperty}
          />
        </div>
      </div>
    );
  }

  @boundMethod
  private labelChange(labelProperty: PropertySchema) {
    const { onChange, value } = this.props;

    if (value.type !== 'polygon') {
      throw this.ruleTypeError;
    }

    const rule: PolygonRule = {
      ...value.rule,
      labelProperty
    };

    onChange({ ...value, rule });
  }

  @boundMethod
  private handleStrokeChange(stroke: Pick<LineRule, 'strokeWidth' | 'strokeDashArray'>) {
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
  private handleStrokeColorChange(color: string) {
    this.colorChange('strokeColor', color);
  }

  @boundMethod
  private handleFillColorChange(color: string) {
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
  private handleFillGraphicChange(graphic: PolygonRule['fillGraphic']) {
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
