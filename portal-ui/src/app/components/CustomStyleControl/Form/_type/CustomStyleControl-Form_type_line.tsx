import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { boundMethod } from 'autobind-decorator';
import { withBemMod } from '@bem-react/core';

import { LineRule, customStyleStrokeColors } from '../../../../services/geoserver/styles/styles.models';

import { CustomStyleControlFormProps, cnCustomStyleControlForm } from '../CustomStyleControl-Form.base';
import { CustomStyleControlStrokeSelect } from '../../StrokeSelect/CustomStyleControl-StrokeSelect';
import { CustomStyleControlColorSelect } from '../../ColorSelect/CustomStyleControl-ColorSelect';

@observer
class CustomStyleControlFormTypeLine extends Component<CustomStyleControlFormProps> {
  private ruleTypeError = new Error('Неправильный тип стиля');

  render() {
    const { className, value } = this.props;

    if (value.type !== 'line') {
      throw this.ruleTypeError;
    }

    return (
      <div className={cnCustomStyleControlForm(null, [className])}>
        <CustomStyleControlStrokeSelect
          label='линия'
          value={value.rule}
          color={value.rule.strokeColor}
          onChange={this.strokeChangeHandler}
        />
        <CustomStyleControlColorSelect
          colors={customStyleStrokeColors}
          value={value.rule.strokeColor}
          onChange={this.colorChangeHandler}
        />
      </div>
    );
  }

  @boundMethod
  private strokeChangeHandler(stroke: Pick<LineRule, 'strokeWidth' | 'strokeDashArray'>) {
    const { onChange, value } = this.props;

    if (value.type !== 'line') {
      throw this.ruleTypeError;
    }

    const rule: LineRule = {
      ...value.rule,
      strokeDashArray: stroke.strokeDashArray,
      strokeWidth: stroke.strokeWidth
    };

    onChange({ ...value, rule });
  }

  @boundMethod
  private colorChangeHandler(color: string) {
    const { onChange, value } = this.props;

    if (value.type !== 'line') {
      throw this.ruleTypeError;
    }

    const rule: LineRule = {
      ...value.rule,
      strokeColor: color
    };

    onChange({ ...value, rule });
  }
}

export const withTypeLine = withBemMod<CustomStyleControlFormProps, CustomStyleControlFormProps>(
  cnCustomStyleControlForm(),
  { type: 'line' },
  () => CustomStyleControlFormTypeLine
);
